import { Module } from '@nestjs/common'
import { DefaultController } from './default.controller'
import { DefaultService } from './default.service'
import { PrismaModule } from 'src/utility-modules/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [DefaultController],
  providers: [DefaultService],
})
export class DefaultModule {}
