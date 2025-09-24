import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/utility-modules/prisma/prisma.module'

import { DefaultController } from './default.controller'
import { DefaultService } from './default.service'

@Module({
  imports: [PrismaModule],
  controllers: [DefaultController],
  providers: [DefaultService],
})
export class DefaultModule {}
