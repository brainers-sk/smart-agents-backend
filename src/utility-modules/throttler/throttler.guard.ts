import { Injectable } from '@nestjs/common'
import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler'
import { Request } from 'express'

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  // eslint-disable-next-line @typescript-eslint/require-await
  protected async getTracker(req: Request): Promise<string> {
    return req.ip ?? ''
  }

  protected async handleRequest(
    requestProps: ThrottlerRequest,
  ): Promise<boolean> {
    const req = requestProps.context.switchToHttp().getRequest<Request>()
    const ip = req.ip ?? ''

    // ✅ povolené IP rozsahy (bez limitu)
    if (
      ip === '127.0.0.1' ||
      ip === '::1' ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.')
    ) {
      return true
    }

    // 🔁 fallback on default logic
    return super.handleRequest(requestProps)
  }
}
