import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common'
import { Request } from 'express'
import { URL } from 'url'
import { PrismaService } from '../prisma/prisma.service'

type DomainPattern = string

@Injectable()
export class ChatbotOriginGuard implements CanActivate {
  private readonly logger = new Logger(ChatbotOriginGuard.name)

  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    const chatbotUuid =
      req.params.chatbotUuid || req.params.id || req.params.uuid

    if (!chatbotUuid) {
      throw new ForbiddenException('Chatbot not specified')
    }

    const bot = await this.prisma.chatbot.findUnique({
      where: { uuid: chatbotUuid },
      select: { allowedDomains: true },
    })

    if (!bot) {
      throw new ForbiddenException('Chatbot not found')
    }

    const originHeader = req.headers['origin'] as string | undefined
    const referer = req.headers['referer'] as string | undefined
    const source = originHeader ?? referer
    if (!source) {
      this.logger.warn('No Origin/Referer header present')
      throw new ForbiddenException('Forbidden')
    }

    let hostname: string
    try {
      hostname = new URL(source).hostname.toLowerCase()
    } catch (err) {
      this.logger.warn(`Invalid origin/referer: ${source}`)
      throw new ForbiddenException('Forbidden')
    }

    const allowed: string[] = (bot.allowedDomains ?? []).map((d: string) =>
      this.normalizeDomain(d),
    )

    const matches = allowed.some((pattern: string) =>
      this.checkHostMatchesPattern(hostname, pattern),
    )

    if (!matches) {
      this.logger.warn(
        `Origin ${hostname} not allowed for chatbot ${chatbotUuid}`,
      )
      throw new ForbiddenException('Forbidden')
    }

    return true
  }

  private normalizeDomain(input: string): string {
    try {
      return new URL(input).hostname.toLowerCase()
    } catch {
      return input.toLowerCase()
    }
  }

  private checkHostMatchesPattern(hostname: string, pattern: string): boolean {
    if (pattern.startsWith('*.')) {
      const domain = pattern.slice(2) // napr. *.example.com → example.com
      return hostname === domain || hostname.endsWith('.' + domain)
    }
    return hostname === pattern
  }
}
