import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/utility-modules/prisma/prisma.service'

@Injectable()
export class EmbedService {
  constructor(private readonly prisma: PrismaService) {}

  async getEmbedHtml(chatbotUuid: string): Promise<string> {
    const bot = await this.prisma.chatbot.findUnique({
      where: { uuid: chatbotUuid },
      select: { name: true, themeCss: true, allowCustomerRating: true },
    })

    if (!bot) throw new NotFoundException('Chatbot not found')

    const defaultCss = `/* default styling tu (vieme ponechať tvoju červenú) */`

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${bot.name ?? 'Chatbot'}</title>
  <style>${bot.themeCss ?? defaultCss}</style>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>
<body>
  <div id="chat">
    <header>${bot.name ?? 'AI Assistant'}</header>
    <div class="messages" id="messages"></div>
    <div class="input-bar">
      <input id="msg" type="text" placeholder="Type a message..." />
      <button onclick="send()">Send</button>
    </div>
    <div id="rating-placeholder" style="border-top:1px solid #eee;"></div>
  </div>
  <script>
    let sessionUuid = null;
    let firstReply = true;

    async function send() {
      const input = document.getElementById('msg');
      const text = input.value;
      if (!text) return;
      addMessage('user', text);
      input.value = '';

      addLoader();

      const res = await fetch('/chat/${chatbotUuid}/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionUuid })
      });
      const data = await res.json();
      if (data.sessionUuid) sessionUuid = data.sessionUuid;

      removeLoader();
      addMessage('assistant', data.reply);

      if (firstReply && ${bot.allowCustomerRating ? 'true' : 'false'}) {
        showRatingInvite();
        firstReply = false;
      }
    }

    function addMessage(role, text) {
      const messages = document.getElementById('messages');
      const div = document.createElement('div');
      div.className = 'message ' + role;
      div.innerHTML = marked.parse(text);
      div.querySelectorAll("a").forEach(a => {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      });
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function addLoader() {
      const messages = document.getElementById('messages');
      const div = document.createElement('div');
      div.className = 'message assistant loader';
      div.id = 'loader';
      div.innerHTML = 'Hľadám informácie <div class="loader-dots"><span></span><span></span><span></span></div>';
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function removeLoader() {
      document.getElementById('loader')?.remove();
    }

    // Rating UI
    function showRatingInvite(){
      const ratingDiv=document.getElementById('rating-placeholder');
      ratingDiv.innerHTML='<div style="padding:0.5rem;text-align:center;cursor:pointer;color:#df4425;font-weight:500;" onclick="openRating()">⭐ Ohodnoť ma</div>';
    }

    function openRating(){
      const ratingDiv=document.getElementById('rating-placeholder');
      ratingDiv.innerHTML=\`
        <div style="padding:0.5rem;display:flex;flex-direction:column;gap:0.5rem">
          <div id="stars" style="text-align:center"></div>
          <input id="feedback" type="text" placeholder="Your feedback" style="width:100%;padding:0.4rem;border:1px solid #ccc;border-radius:6px"/>
          <div style="display:flex;justify-content:flex-end;gap:0.5rem">
            <button onclick="cancelRating()" style="background:none;border:none;color:#df4425;cursor:pointer;font-weight:500">Cancel</button>
            <button onclick="submitRating()" style="padding:0.4rem 0.8rem;border:none;border-radius:6px;background:#df4425;color:#fff;cursor:pointer">Send</button>
          </div>
        </div>\`;

      const stars=document.getElementById('stars');
      for(let i=1;i<=5;i++){
        const s=document.createElement('span');
        s.textContent='★';
        s.style.cursor='pointer';
        s.style.fontSize='24px';
        s.style.color='#ccc';
        s.dataset.value=i;
        s.onclick=()=>selectStars(i);
        stars.appendChild(s);
      }
    }

    function selectStars(n){
      const stars=document.querySelectorAll('#stars span');
      stars.forEach((s,idx)=>{ s.style.color= (idx < n) ? '#df4425' : '#ccc'; });
      document.getElementById('stars').dataset.selected=n;
    }

    function cancelRating(){ showRatingInvite(); }

    async function submitRating(){
      const stars=document.getElementById('stars').dataset.selected || 0;
      const feedback=document.getElementById('feedback').value;
      await fetch('/chat/'+sessionUuid+'/rating',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({customerRating:Number(stars),customerFeedback:feedback})
      });
      document.getElementById('rating-placeholder').innerHTML='';
    }

    document.getElementById('msg').addEventListener("keydown", e=>{
      if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); send(); }
    });
  </script>
</body>
</html>
`
  }
}
