import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { LoggerModule } from './utility-modules/logger/logger.module'
import { DefaultModule } from './controller-modules/default/default.module'
import { ChatbotModule } from './controller-modules/chatbot/chatbot.module'
import { ChatModule } from './controller-modules/chat/chat.module'
import { WidgetModule } from './controller-modules/widget/widget.module'
import { EmbedModule } from './controller-modules/embed/embed.module'

@Module({
  imports: [
    LoggerModule,
    DefaultModule,
    ChatbotModule,
    ChatModule,
    WidgetModule,
    EmbedModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
