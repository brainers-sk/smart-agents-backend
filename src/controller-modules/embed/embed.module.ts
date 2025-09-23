import { Module } from '@nestjs/common'

import { EmbedController } from './embed.controller'
import { PrismaModule } from 'src/utility-modules/prisma/prisma.module'
import { EmbedService } from './embed.service'
import { ThrottlerModule } from 'src/utility-modules/throttler/throttler.module'

@Module({
  imports: [PrismaModule, ThrottlerModule],
  controllers: [EmbedController],
  providers: [EmbedService],
})
export class EmbedModule {}
