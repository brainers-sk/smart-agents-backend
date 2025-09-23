import { Controller, Get } from '@nestjs/common'
import { DefaultService } from './default.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetChatbotDto } from '../chatbot/chatbot.dto'
import { GetHealthCheckDto } from './default.dto'

@Controller()
@ApiTags('default')
export class DefaultController {
  constructor(private readonly defaultService: DefaultService) {}

  @ApiOperation({
    summary: 'Healthcheck',
    description: 'Healthcheck',
  })
  @ApiResponse({
    status: 200,
    description: 'Healthcheck',
    type: GetHealthCheckDto,
  })
  @Get('health')
  async health(): Promise<GetHealthCheckDto> {
    return this.defaultService.health()
  }
}
