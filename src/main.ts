import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'

import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const port = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  app.useLogger(app.get(Logger))
  const corsOptions = {
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, x-tenant-slag',
  }
  app.enableCors(corsOptions)

  // app.use((req: Request, res: Response, next: NextFunction) => {
  //   console.log('Authorization header:', req.headers['authorization'])
  //   next()
  // })
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  const config = new DocumentBuilder()
    .setTitle('Booking module')
    .setDescription('Backend for booking module for eliberty systems')
    .setVersion('1.0')
    .setContact('brainers', 'https://brainers.sk', 'lukas.polesnak@brainers.sk')
    .addServer(`http://localhost:${port}/`)
    .addApiKey({ type: 'apiKey', name: 'X-Api-Key', in: 'header' }, 'apiKey')
    .addBearerAuth({
      type: 'http',
      description: 'Get token from Cognito',
    })
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(port)

  console.info(`Nest is running on port: ${port}`)
}

void bootstrap()
