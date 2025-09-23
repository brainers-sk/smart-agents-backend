import { Module } from '@nestjs/common'
import { WidgetController } from './widget.controller'
import { WidgetService } from './widget.service'
import { PrismaModule } from 'src/utility-modules/prisma/prisma.module'
import { ThrottlerModule } from 'src/utility-modules/throttler/throttler.module'

@Module({
  imports: [PrismaModule, ThrottlerModule],
  controllers: [WidgetController],
  providers: [WidgetService],
})
export class WidgetModule {}
