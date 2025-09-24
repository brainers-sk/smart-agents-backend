import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/utility-modules/prisma/prisma.module'
import { ThrottlerModule } from 'src/utility-modules/throttler/throttler.module'

import { EmbedController } from './embed.controller'
import { EmbedService } from './embed.service'

@Module({
  imports: [PrismaModule, ThrottlerModule],
  controllers: [EmbedController],
  providers: [EmbedService],
})
export class EmbedModule {}
