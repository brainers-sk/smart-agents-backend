import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/utility-modules/prisma/prisma.service'
import { RequestGetItemsDto } from 'src/utils/dtos/global.dto'
import { prismaQueryTransformation } from 'src/utils/data-manipulations/prisma'

import {
  CreateChatbotDto,
  GetChatbotsDto,
  UpdateChatbotDto,
} from './chatbot.dto'

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
    console.log('tuuu', data)
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
    const tags = await this.prismaService.$queryRaw<
      { tag: string }[]
    >`SELECT DISTINCT unnest("adminTag") as tag
    FROM "ChatSession" cs
    JOIN "Chatbot" c ON c.id = cs."chatbotId"
    WHERE c.uuid = ${chatbotUuid}::uuid;`

    const uniqueTags = tags.map((t) => t.tag)
    return uniqueTags
  }

  async getChatbotStats(query: RequestGetItemsDto) {
    const { prismaQuery, pages } = prismaQueryTransformation(query)

    const items = await this.prismaService.$queryRaw<
      {
        uuid: string
        name: string
        conversationCount: number
        lastConversationAt: Date | null
        averageCustomerRating: number | null
        totalMessages: number
        messagesPerConversation: number
      }[]
    >`
     SELECT 
        c.uuid,
        c.name,
        COALESCE(stats."conversationCount", 0) AS "conversationCount",
        stats."lastConversationAt",
        stats."averageCustomerRating",
        COALESCE(stats."totalMessages", 0) AS "totalMessages",
        CASE 
          WHEN stats."totalMessages" = 0 THEN 0
          ELSE ROUND(stats."conversationCount" / stats."totalMessages"::numeric , 2)
        END AS "messagesPerConversation"
      FROM "Chatbot" c
      LEFT JOIN (
        SELECT 
          s."chatbotId",
          COUNT(s.id)::int AS "conversationCount",
          MAX(s."createdAt") AS "lastConversationAt",
          ROUND(AVG(s."customerRating")::numeric, 1)::float AS "averageCustomerRating",
          COALESCE(SUM(sub."messageCount"), 0)::int AS "totalMessages"
        FROM "ChatSession" s
        LEFT JOIN (
          SELECT m."chatSessionId", COUNT(m.id) AS "messageCount"
          FROM "ChatMessage" m
          GROUP BY m."chatSessionId"
        ) sub ON sub."chatSessionId" = s.id
        GROUP BY s."chatbotId"
      ) stats ON stats."chatbotId" = c.id
      ORDER BY c."createdAt" DESC
      LIMIT ${pages.pagination} OFFSET ${(pages.currentPage - 1) * pages.pagination};
    `

    const totalItems = await this.prismaService.chatbot.count(prismaQuery)
    const totalPages = Math.ceil(totalItems / pages.pagination)

    return {
      items,
      pagination: {
        ...pages,
        totalItems,
        totalPages,
      },
    }
  }
}
