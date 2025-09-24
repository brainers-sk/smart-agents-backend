import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/utility-modules/prisma/prisma.module'
import { ThrottlerModule } from 'src/utility-modules/throttler/throttler.module'

import { WidgetController } from './widget.controller'
import { WidgetService } from './widget.service'

@Module({
  imports: [PrismaModule, ThrottlerModule],
  controllers: [WidgetController],
  providers: [WidgetService],
})
export class WidgetModule {}
