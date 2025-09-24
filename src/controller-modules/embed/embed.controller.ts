import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { ChatbotOriginGuard } from 'src/utility-modules/auth/chatbot-origin.guard'
import { ThrottlerGuard, Throttle } from '@nestjs/throttler'

import { EmbedService } from './embed.service'

@Controller('embed')
export class EmbedController {
  constructor(private readonly embedService: EmbedService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 200, ttl: 60 } })
  @UseGuards(ChatbotOriginGuard)
  @Get(':chatbotUuid')
  async embed(@Param('chatbotUuid') chatbotUuid: string, @Res() res: Response) {
    const html = await this.embedService.getEmbedHtml(chatbotUuid)
    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  }
}
