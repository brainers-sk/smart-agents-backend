import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsInt } from 'class-validator'
import { Transform } from 'class-transformer'

export class DefaultEntityProperties {
  @ApiProperty({
    description: 'Id number for database joining',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Uuid for finding',
    example: '00000000-0000-0000-0000-000000000000',
  })
  uuid: string

  @ApiProperty({
    description: 'Date of creation',
    example: '2024-01-01',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Date of update',
    example: '2024-01-01',
  })
  updatedAt: Date

  @ApiProperty({
    description: 'UUID of user, who create it',
    example: '2024-01-01',
  })
  createdBy: string

  @ApiProperty({
    description: 'UUID of user, who updated it',
    example: '2024-01-01',
  })
  updatedBy: string
}

export class ResponseGetItemsPaginationDto {
  @ApiProperty({
    description: 'The page, we are on',
    example: 1,
  })
  currentPage: number

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  pagination: number

  @ApiProperty({
    description: 'Total number of pages per current pagination',
    example: 100,
  })
  totalPages: number

  @ApiProperty({
    description: 'Total number of items pre filter',
    example: 100,
  })
  totalItems: number
}

export class RequestGetItemsDto {
  @ApiPropertyOptional({
    description: 'The page, we are on',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(String(value), 10))
  currentPage?: number

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(String(value), 10))
  pagination?: number
}

export enum DefaultResponseEnum {
  SUCCESS = 'success',
  FAIL = 'fail',
}

export class DefaultResponseDto {
  @ApiProperty({
    description: 'response message',
  })
  message: string

  @ApiProperty({
    description: 'Was it success?',
    example: 'success',
  })
  response: DefaultResponseEnum
}
