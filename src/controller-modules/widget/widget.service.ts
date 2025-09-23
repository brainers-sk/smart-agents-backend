import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/utility-modules/prisma/prisma.service'

@Injectable()
export class WidgetService {
  constructor(private readonly prismaService: PrismaService) {}

  async getChatbot(uuid: string) {
    const bot = await this.prismaService.chatbot.findUnique({ where: { uuid } })
    if (!bot) throw new NotFoundException('Chatbot not found')
    return bot
  }
}
