import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { AzureADStrategy } from './azure.strategy'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'azure-ad' })],
  providers: [AzureADStrategy],
  exports: [AzureADStrategy],
})
export class AuthModule {}
