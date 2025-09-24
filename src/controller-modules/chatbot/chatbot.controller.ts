import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ChatbotService } from './chatbot.service'
import {
  CreateChatbotDto,
  GetChatbotDto,
  GetChatbotParamDto,
  GetChatbotsDto,
  GetChatbotStatsDto,
  GetChatbotWithTagsDto,
  UpdateChatbotDto,
} from './chatbot.dto'
import { RequestGetItemsDto } from 'src/utils/dtos/global.dto'
import { AuthGuard } from '@nestjs/passport'

@ApiBearerAuth()
@UseGuards(AuthGuard('azure-ad'))
@Controller('admin/chatbot')
@ApiTags('Admin Modules')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @ApiOperation({
    summary: 'Return chatbot',
    description: 'Return chatbot',
  })
  @ApiResponse({
    status: 200,
    description: 'Return chatbot data',
    type: GetChatbotsDto,
  })
  @Get('list')
  async getChatbots(
    @Query() query: RequestGetItemsDto,
  ): Promise<GetChatbotsDto> {
    const chatbots = await this.chatbotService.getChatbots(query)
    return chatbots
  }

  @ApiOperation({
    summary: 'Return chatbot',
    description: 'Return chatbot',
  })
  @ApiResponse({
    status: 200,
    description: 'Return chatbot data',
    type: GetChatbotWithTagsDto,
  })
  @Get(':chatbotUuid')
  async getChatbot(
    @Param() params: GetChatbotParamDto,
  ): Promise<GetChatbotWithTagsDto> {
    const chatbot = await this.chatbotService.getChatbot(params.chatbotUuid)
    return chatbot
  }

  @ApiOperation({
    summary: 'Create chatbot',
    description: 'Create chatbot',
  })
  @ApiResponse({
    status: 200,
    description: 'Create chatbot data',
    type: GetChatbotDto,
  })
  @Post('')
  async createChatbot(@Body() data: CreateChatbotDto): Promise<GetChatbotDto> {
    const chatbot = await this.chatbotService.createChatbot(data)
    return chatbot
  }

  @ApiOperation({
    summary: 'Update chatbot',
    description: 'Update chatbot',
  })
  @ApiResponse({
    status: 200,
    description: 'Update chatbot data',
    type: GetChatbotDto,
  })
  @Patch(':chatbotUuid')
  async updateChatbot(
    @Param() params: GetChatbotParamDto,
    @Body() data: UpdateChatbotDto,
  ): Promise<GetChatbotDto> {
    const chatbot = await this.chatbotService.updateChatbot(
      params.chatbotUuid,
      data,
    )
    return chatbot
  }

  @ApiOperation({
    summary: 'Delete chatbot',
    description: 'Delete chatbot',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete chatbot data',
    type: GetChatbotDto,
  })
  @Delete(':chatbotUuid')
  async deleteChatbot(
    @Param() params: GetChatbotParamDto,
  ): Promise<GetChatbotDto> {
    const chatbot = await this.chatbotService.deleteChatbot(params.chatbotUuid)
    return chatbot
  }

  @ApiOperation({
    summary: 'Return chatbot statistics',
    description: 'Aggregated statistics for each chatbot with pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'List of chatbots with statistics',
    type: GetChatbotStatsDto,
  })
  @Get('stats/list')
  async getChatbotStats(
    @Query() query: RequestGetItemsDto,
  ): Promise<GetChatbotStatsDto> {
    const stats = await this.chatbotService.getChatbotStats(query)
    return stats
  }
}
