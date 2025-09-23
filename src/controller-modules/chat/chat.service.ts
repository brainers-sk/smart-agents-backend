import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/utility-modules/prisma/prisma.service'
import {
  GetChatSessionMessagesDto,
  GetChatSessionsDto,
  GetChatSessionsQueryDto,
  SendCustomerRatingDto,
  SendMessageDto,
} from './chat.dto'
import { OpenAiService } from 'src/utility-modules/openai/openai.service'
import { DefaultResponseEnum } from 'src/utils/dtos/global.dto'
import { prismaQueryTransformation } from 'src/utils/data-manipulations/prisma'

@Injectable()
export class ChatService {
  constructor(
    private prismaService: PrismaService,
    private ai: OpenAiService,
  ) {}

  async send(chatbotUuid: string, data: SendMessageDto) {
    const { message, sessionUuid } = data
    const bot = await this.prismaService.chatbot.findUnique({
      where: { uuid: chatbotUuid },
    })
    if (!bot) throw new NotFoundException('Chatbot not found')

    // Ensure session exists
    let session = sessionUuid
      ? await this.prismaService.chatSession.findUnique({
          where: { uuid: sessionUuid },
        })
      : null

    if (!session) {
      session = await this.prismaService.chatSession.create({
        data: { chatbotId: bot.id },
      })
    }

    // Store user message
    await this.prismaService.chatMessage.create({
      data: { chatSessionId: session.id, role: 'user', content: message },
    })

    // Collect conversation history
    const history = await this.prismaService.chatMessage.findMany({
      where: { chatSessionId: session.id },
      orderBy: { createdAt: 'asc' },
    })

    // Ask OpenAI
    const reply = await this.ai.chat(
      bot.model,
      bot.instructions,
      history.map((m) => ({ role: m.role as any, content: m.content })),
      bot.temperature,
    )

    // Store AI reply
    await this.prismaService.chatMessage.create({
      data: { chatSessionId: session.id, role: 'assistant', content: reply },
    })

    return { sessionUuid: session.uuid, reply }
  }

  async SendCustomerRating(sessionUuid: string, data: SendCustomerRatingDto) {
    const session = await this.prismaService.chatSession.update({
      where: {
        uuid: sessionUuid,
      },
      data: {
        ...data,
      },
    })
    if (!session) {
      throw new NotFoundException('session was not found')
    }
    return {
      message: 'Rating and feedback was sent',
      response: DefaultResponseEnum.SUCCESS,
    }
  }

  async getChatSessions(
    chatbotUuid: string,
    query: GetChatSessionsQueryDto,
  ): Promise<GetChatSessionsDto> {
    console.log('tuuu')
    const { prismaQuery, pages } = prismaQueryTransformation(query)
    const sessions = await this.prismaService.chatSession.findMany({
      ...prismaQuery,
      where: {
        chatbot: {
          uuid: chatbotUuid,
        },
        ...(query.customerRating
          ? {
              customerRating: {
                in: query.customerRating,
              },
            }
          : {}),
        ...(query.adminRating
          ? {
              adminRating: {
                in: query.adminRating,
              },
            }
          : {}),
        ...(query.adminTag
          ? {
              adminTag: {
                hasSome: query.adminTag,
              },
            }
          : {}),
        chatMessages: {
          some: {
            content: {
              contains: query.search,
            },
          },
        },
        customerFeedback: {
          contains: query.customerFeedback,
        },
      },
      include: {
        chatMessages: {
          take: 1,
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })
    const totalItems = await this.prismaService.chatSession.count(prismaQuery)
    const totalPages = Math.ceil(totalItems / pages.pagination)

    const items = sessions.map((session) => ({
      uuid: session.uuid,
      createdAt: session.createdAt,
      adminRating: session.adminRating,
      adminTag: session.adminTag,
      customerFeedback: session.customerFeedback,
      customerRating: session.customerRating,
      firstChat: session.chatMessages?.length ? session.chatMessages[0] : null,
    }))

    return {
      items,
      pagination: {
        ...pages,
        totalItems,
        totalPages,
      },
    }
  }

  async getChatSessionMessages(
    sessionUuid: string,
  ): Promise<GetChatSessionMessagesDto> {
    const session = await this.prismaService.chatSession.findUnique({
      where: {
        uuid: sessionUuid,
      },
      include: {
        chatMessages: true,
      },
    })
    if (!session) {
      throw new NotFoundException('session was not found')
    }
    return session
  }

  async addTagToSession(sessionUuid: string, tag: string) {
    const session = await this.prismaService.chatSession.findUnique({
      where: { uuid: sessionUuid },
    })
    if (!session) {
      throw new NotFoundException('Session not found')
    }

    const updated = await this.prismaService.chatSession.update({
      where: { uuid: sessionUuid },
      data: {
        adminTag: {
          push: tag, // append new tag to existing array
        },
      },
    })

    return {
      message: `Tag "${tag}" added`,
      response: DefaultResponseEnum.SUCCESS,
    }
  }

  async removeTagFromSession(sessionUuid: string, tag: string) {
    const session = await this.prismaService.chatSession.findUnique({
      where: { uuid: sessionUuid },
    })
    if (!session) {
      throw new NotFoundException('Session not found')
    }

    const filteredTags = (session.adminTag || []).filter((t) => t !== tag)

    await this.prismaService.chatSession.update({
      where: { uuid: sessionUuid },
      data: {
        adminTag: filteredTags,
      },
    })

    return {
      message: `Tag "${tag}" removed`,
      response: DefaultResponseEnum.SUCCESS,
    }
  }
}
