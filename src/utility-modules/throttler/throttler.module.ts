import { Module } from '@nestjs/common'
import { ThrottlerModule as NestThrottlerModule } from '@nestjs/throttler'

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
