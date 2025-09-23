import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ChatMessageRole } from '@prisma/client'
import { Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator'
import {
  RequestGetItemsDto,
  ResponseGetItemsPaginationDto,
} from 'src/utils/dtos/global.dto'

export class SendMessageDto {
  @ApiProperty({ description: 'message to send to chatbot' })
  @IsNotEmpty()
  @IsString()
  message: string

  @ApiPropertyOptional({
    description: 'Uuid of session if it is in one session',
  })
  @IsOptional()
  @IsString()
  sessionUuid?: string
}

export class SendMessageReplyDto {
  @ApiProperty({ description: 'Uuid of session if it is in one session' })
  sessionUuid: string

  @ApiProperty({ description: 'Response from chat' })
  reply: string
}

export class SendCustomerRatingDto {
  @ApiProperty({
    description: 'Rating in stars as number from 0 to 5',
    example: 5,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(5)
  customerRating: number

  @ApiPropertyOptional({
    description: 'Text feedback of customer',
    example: 'It was perfect',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Feedback must be at most 200 characters long' })
  customerFeedback?: string
}

export class GetChatSessionsQueryDto extends RequestGetItemsDto {
  @ApiPropertyOptional({
    description: 'Rating by customer',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  customerRating?: number[]

  @ApiPropertyOptional({
    description: 'Rating by admin',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  adminRating?: number[]

  @ApiPropertyOptional({
    description: 'Tags created by admin',
    example: ['paas'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  adminTag?: string[]

  @ApiPropertyOptional({
    description: 'Search string in messages',
    example: 'parkovanie',
  })
  @IsOptional()
  search?: string

  @ApiPropertyOptional({
    description: 'Search string in customer feedback',
    example: 'parkovanie',
  })
  @IsOptional()
  customerFeedback?: string
}

export class GetChatDto {
  uuid: string
  createdAt: Date
  content: string // message
  role: ChatMessageRole
}

export class GetChatSessionDto {
  uuid: string
  createdAt: Date
  customerRating: number | null
  customerFeedback: string | null
  adminRating: number | null
  adminTag: string[] | null
  firstChat: GetChatDto | null
}

export class GetChatSessionMessagesDto {
  uuid: string
  createdAt: Date
  customerRating: number | null
  customerFeedback: string | null
  adminRating: number | null
  adminTag: string[]
  chatMessages: GetChatDto[]
}

export class GetChatSessionsDto {
  items: GetChatSessionDto[]
  pagination: ResponseGetItemsPaginationDto
}

export class AddOrRemoveTagDto {
  @ApiProperty({
    description: 'name of tag',
    example: 'test',
  })
  tag: string
}
