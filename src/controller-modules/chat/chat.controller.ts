import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ChatService } from './chat.service'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  GetChatSessionMessagesDto,
  GetChatSessionsDto,
  GetChatSessionsQueryDto,
  SendCustomerRatingDto,
  SendMessageDto,
  SendMessageReplyDto,
} from './chat.dto'
import { ChatbotOriginGuard } from 'src/utility-modules/auth/chatbot-origin.guard'
import { Throttle, ThrottlerGuard } from '@nestjs/throttler'
import { DefaultResponseDto } from 'src/utils/dtos/global.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({
    summary: 'Send Message',
    description: 'Send Message',
  })
  @ApiResponse({
    status: 200,
    description: 'Send Message',
    type: SendMessageReplyDto,
  })
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 50, ttl: 60 } })
  @UseGuards(ChatbotOriginGuard)
  @Post(':chatbotUuid/message')
  send(
    @Param('chatbotUuid') chatbotUuid: string,
    @Body() data: SendMessageDto,
  ) {
    return this.chatService.send(chatbotUuid, data)
  }

  @ApiOperation({
    summary: 'Send customer rating and feedback',
    description: 'Send customer rating and feedback',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer rating and feedback was sent',
    type: DefaultResponseDto,
  })
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 50, ttl: 60 } })
  @Post(':sessionUuid/rating')
  sendCustomerRating(
    @Param('sessionUuid') sessionUuid: string,
    @Body() data: SendCustomerRatingDto,
  ): Promise<DefaultResponseDto> {
    return this.chatService.SendCustomerRating(sessionUuid, data)
  }

  @ApiOperation({
    summary: 'Return session',
    description: 'Return session',
  })
  @ApiResponse({
    status: 200,
    description: 'Return session data',
    type: GetChatSessionMessagesDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('azure-ad'))
  @Get('session/:sessionUuid/messages')
  async getChatSessionMessages(
    @Param('sessionUuid') sessionUuid: string,
  ): Promise<GetChatSessionMessagesDto> {
    const session = await this.chatService.getChatSessionMessages(sessionUuid)
    return session
  }

  @ApiOperation({
    summary: 'Return module',
    description: 'Return module',
  })
  @ApiResponse({
    status: 200,
    description: 'Return module data',
    type: GetChatSessionsDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('azure-ad'))
  @Get('chatbot/:chatbotUuid/sessions')
  async getChatbot(
    @Param('chatbotUuid') chatbotUuid: string,
    @Query() query: GetChatSessionsQueryDto,
  ): Promise<GetChatSessionsDto> {
    const sessions = await this.chatService.getChatSessions(chatbotUuid, query)
    return sessions
  }

  @ApiOperation({
    summary: 'Add a tag to a session',
    description: 'Add a tag to a session (admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Tag added',
    type: DefaultResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('azure-ad'))
  @Post('session/:sessionUuid/add-tag')
  async addTagToSession(
    @Param('sessionUuid') sessionUuid: string,
    @Body('tag') tag: string,
  ): Promise<DefaultResponseDto> {
    return this.chatService.addTagToSession(sessionUuid, tag)
  }

  @ApiOperation({
    summary: 'Remove a tag from a session',
    description: 'Remove a tag from a session (admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Tag removed',
    type: DefaultResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('azure-ad'))
  @Post('session/:sessionUuid/remove-tag')
  async removeTagFromSession(
    @Param('sessionUuid') sessionUuid: string,
    @Body('tag') tag: string,
  ): Promise<DefaultResponseDto> {
    return this.chatService.removeTagFromSession(sessionUuid, tag)
  }
}
