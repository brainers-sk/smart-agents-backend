import { Module } from '@nestjs/common'
import { ThrottlerModule as NestThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { CustomThrottlerGuard } from './throttler.guard'

@Module({
  imports: [
    NestThrottlerModule.forRoot([
      {
        ttl: 60, // časové okno (sekundy)
        limit: 30, // max requests / ttl
      },
    ]),
  ],
})
export class ThrottlerModule {}
