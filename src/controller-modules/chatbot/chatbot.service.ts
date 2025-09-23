import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/utility-modules/prisma/prisma.service'
import { RequestGetItemsDto } from 'src/utils/dtos/global.dto'
import {
  CreateChatbotDto,
  GetChatbotsDto,
  UpdateChatbotDto,
} from './chatbot.dto'
import { prismaQueryTransformation } from 'src/utils/data-manipulations/prisma'

@Injectable()
export class ChatbotService {
  constructor(private readonly prismaService: PrismaService) {}

  async getChatbots(query: RequestGetItemsDto): Promise<GetChatbotsDto> {
    const { prismaQuery, pages } = prismaQueryTransformation(query)
    const chatbots = await this.prismaService.chatbot.findMany(prismaQuery)
    const totalItems = await this.prismaService.chatbot.count(prismaQuery)
    const totalPages = Math.ceil(totalItems / pages.pagination)
    return {
      items: chatbots,
      pagination: {
        ...pages,
        totalItems,
        totalPages,
      },
    }
  }

  async getChatbot(chatbotUuid: string) {
    const chatbot = await this.prismaService.chatbot.findUnique({
      where: {
        uuid: chatbotUuid,
      },
    })
    const tags = await this.getChatbotTags(chatbotUuid)
    if (!chatbot) {
      throw new NotFoundException('Chatbot was not found')
    }
    return { ...chatbot, tags }
  }

  async createChatbot(data: CreateChatbotDto) {
    const chatbot = await this.prismaService.chatbot.create({
      data: {
        ...data,
        createdBy: '', // TBD
        updatedBy: '', // TBD
      },
    })
    return chatbot
  }

  async updateChatbot(chatbotUuid: string, data: UpdateChatbotDto) {
    const chatbot = await this.prismaService.chatbot.update({
      where: {
        uuid: chatbotUuid,
      },
      data: {
        ...data,
      },
    })
    if (!chatbot) {
      throw new NotFoundException('Chatbot was not found')
    }
    return chatbot
  }

  async deleteChatbot(chatbotUuid: string) {
    const chatbot = await this.prismaService.chatbot.delete({
      where: {
        uuid: chatbotUuid,
      },
    })
    if (!chatbot) {
      throw new NotFoundException('Chatbot was not found')
    }
    return chatbot
  }

  private async getChatbotTags(chatbotUuid: string): Promise<string[]> {
    console.log('TUUUUUUUUUUUUUU', chatbotUuid)
    const tags = await this.prismaService.$queryRaw<
      { tag: string }[]
    >`SELECT DISTINCT unnest("adminTag") as tag
    FROM "ChatSession" cs
    JOIN "Chatbot" c ON c.id = cs."chatbotId"
    WHERE c.uuid = ${chatbotUuid}::uuid;`

    const uniqueTags = tags.map((t) => t.tag)
    return uniqueTags
  }
}
