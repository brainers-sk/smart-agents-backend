// src/logger/logger.module.ts
import { Global, Module } from '@nestjs/common'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino'

@Global() // makes logger available everywhere without import
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'debug',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  singleLine: true,
                },
              }
            : undefined,
        autoLogging: true, // logs every request + response
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
