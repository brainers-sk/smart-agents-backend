import { Controller, Get, Header, Param, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { WidgetService } from './widget.service'
import { ChatbotOriginGuard } from 'src/utility-modules/auth/chatbot-origin.guard'
import { ThrottlerGuard, Throttle } from '@nestjs/throttler'

@Controller('widget')
@ApiTags('widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 200, ttl: 60 } })
  @UseGuards(ChatbotOriginGuard)
  @Get(':chatbotUuid.js')
  @Header('Content-Type', 'application/javascript')
  async script(@Param('chatbotUuid') chatbotUuid: string): Promise<string> {
    const bot = await this.widgetService.getChatbot(chatbotUuid)
    const css = bot?.themeCss || ''
    const label = bot?.buttonLabel || '💬'
    const buttonCss = bot?.buttonStyleCss || ''

    return `
(function(){
  try {
    var style = document.createElement('style');
    style.innerHTML = \`${css.replace(/`/g, '\\`')}\`;
    document.head.appendChild(style);
  } catch(e) {}

  var btn = document.createElement('button');
  btn.id = 'ai-agent-launcher';
  btn.innerText = \`${label}\`;
  btn.style.cssText = \`${buttonCss}\`;
  btn.style.position = 'fixed';
  btn.style.bottom = '24px';
  btn.style.right = '24px';
  btn.style.zIndex = '999999';
  document.body.appendChild(btn);

  var backdrop = document.createElement('div');
  backdrop.id = 'ai-agent-backdrop';
  backdrop.style.cssText = 'position:fixed;inset:0;pointer-events:none;background:rgba(0,0,0,0);display:none;z-index:999998;';
  document.body.appendChild(backdrop);

  var panel = document.createElement('div');
  panel.id = 'ai-agent-panel';
  panel.style.cssText = 'position:fixed;bottom:80px;right:24px;width:360px;height:500px;background:#fff;box-shadow:0 10px 30px rgba(0,0,0,.15);border-radius:12px;display:none;overflow:hidden;z-index:999999;';
  panel.innerHTML = '<iframe src="${process.env.APP_URL || 'http://localhost:3000'}/embed/${chatbotUuid}" style="width:100%;height:100%;border:0"></iframe>';
  document.body.appendChild(panel);

  function openPanel(){ panel.style.display='block'; backdrop.style.display='block'; backdrop.style.pointerEvents='auto'; }
  function closePanel(){ panel.style.display='none'; backdrop.style.display='none'; backdrop.style.pointerEvents='none'; }
  function togglePanel(){ if(panel.style.display==='none') openPanel(); else closePanel(); }

  btn.addEventListener('click',function(e){ e.stopPropagation(); togglePanel(); });
  backdrop.addEventListener('click',closePanel);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') closePanel(); });

  // 🟢 cleanup funkcia
  function cleanup(){ [btn, panel, backdrop, style].forEach(el => el && el.remove()); }

  // počúvaj správu z parentu
  window.addEventListener('message', function(e){
    if(e.data?.type === 'REMOVE_CHATBOT'){ cleanup(); }
  });

  window.addEventListener('beforeunload', cleanup);
})();
`
  }
}
