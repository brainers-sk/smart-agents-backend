import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class GetHealthCheckDto {
  @ApiProperty({
    description: 'Is app live?',
  })
  live: boolean

  @ApiProperty({
    description: 'Is database live?',
  })
  database: boolean

  @ApiPropertyOptional({
    description: 'Version of database migration',
  })
  migrationVersion?: string | null

  @ApiProperty({
    description: 'Version of app',
  })
  appVersion: string
}
