import { Injectable } from '@nestjs/common'
import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler'

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.ip // IP ako identifikátor
  }

  protected async handleRequest(
    requestProps: ThrottlerRequest,
  ): Promise<boolean> {
    const ip = requestProps.context.switchToHttp().getRequest().ip || ''

    // ✅ povolené IP rozsahy (bez limitu)
    if (
      ip === '127.0.0.1' ||
      ip === '::1' ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.')
    ) {
      return true
    }

    // 🔁 fallback na defaultnú logiku
    return super.handleRequest(requestProps)
  }
}
