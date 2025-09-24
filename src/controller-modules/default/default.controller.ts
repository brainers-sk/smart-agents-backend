import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { DefaultService } from './default.service'
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
