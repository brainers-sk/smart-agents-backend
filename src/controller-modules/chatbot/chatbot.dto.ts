import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  OmitType,
  PartialType,
} from '@nestjs/swagger'
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator'
import {
  DefaultEntityProperties,
  ResponseGetItemsPaginationDto,
} from 'src/utils/dtos/global.dto'

export enum ChatbotModelEnum {
  GPT5 = 'gpt-5',
  GPT5_MINI = 'gpt-5-mini',
  GPT6_NANO = 'gpt-5-nano',
  GPT4_1 = 'gpt-4.1',
  GPT4_1_MINI = 'gpt-4.1-mini',
  GPT4_1_NANO = 'gpt-4.1-nano',
  O3 = 'o3',
  O4_MINI = 'o4-mini',
  GPT_4O = 'gpt-4o',
  GPT_40_REALTIME_PREVIEW = 'gpt-4o-realtime-preview',
}

export class CreateChatbotDto {
  @ApiProperty({ description: 'Name of the chatbot' })
  @IsString()
  name: string

  @ApiPropertyOptional({
    description: 'Description of the chatbot',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string | null

  @ApiPropertyOptional({
    description: 'System instructions (prompt) for the chatbot',
  })
  @IsString()
  instructions?: string

  @ApiPropertyOptional({
    description: 'Temperature setting for chatbot responses',
    required: false,
    minimum: 0,
    maximum: 2,
    default: 0.2,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number

  @ApiPropertyOptional({
    description: 'OpenAI model to use',
    required: false,
    enum: ChatbotModelEnum,
    enumName: 'ChatbotModelEnum',
  })
  @IsOptional()
  @IsEnum(ChatbotModelEnum)
  model?: string = 'gpt-4o-mini'
}

export class UpdateChatbotDto extends PartialType(CreateChatbotDto) {
  @ApiPropertyOptional({
    description: 'System instructions (prompt) for the chatbot',
  })
  @IsString()
  instructions?: string

  @ApiPropertyOptional({
    description: 'CSS for the chatbot theme',
    required: false,
  })
  @IsOptional()
  @IsString()
  themeCss?: string | null

  @ApiPropertyOptional({
    description: 'Label for the launcher button',
    required: false,
  })
  @IsOptional()
  @IsString()
  buttonLabel?: string | null

  @ApiPropertyOptional({
    description: 'Custom CSS for the launcher button',
    required: false,
  })
  @IsOptional()
  @IsString()
  buttonStyleCss?: string | null

  @ApiPropertyOptional({
    description: 'Will show in chatbot rating?',
    required: false,
    default: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  allowCustomerRating?: boolean

  @ApiPropertyOptional({
    description: 'Allowed domains for chatbot',
    example: 'http://localhost:3000',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  allowedDomains?: string[]
}

export class GetChatbotParamDto {
  @ApiProperty({
    description: 'uuid of chatbot',
    example: '5aca9282-6e68-4cca-adcf-41ba3ea5b496',
  })
  @IsNotEmpty()
  @IsUUID()
  chatbotUuid: string
}

export class GetChatbotDto extends IntersectionType(
  OmitType(UpdateChatbotDto, [] as const),
  DefaultEntityProperties,
) {}

export class GetChatbotWithTagsDto extends IntersectionType(
  OmitType(UpdateChatbotDto, [] as const),
  DefaultEntityProperties,
) {
  @ApiProperty({ description: 'tags of admin' })
  tags: string[]
}

export class GetChatbotsDto {
  @ApiProperty({
    type: GetChatbotDto,
    isArray: true,
  })
  items: GetChatbotDto[]

  @ApiProperty({
    type: GetChatbotDto,
  })
  pagination: ResponseGetItemsPaginationDto
}
