import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SanitizePipe } from './common/pipes/sanitize.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const isProduction = configService.get('NODE_ENV') === 'production';

  // Use Winston logger
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  // Security: Helmet middleware for setting various HTTP headers
  app.use(
    helmet({
      // Content Security Policy
      contentSecurityPolicy: isProduction
        ? {
            directives: {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", 'data:', 'https:'],
              scriptSrc: ["'self'"],
            },
          }
        : false, // Disable CSP in development for Swagger
      // Prevent clickjacking
      frameguard: { action: 'deny' },
      // Hide X-Powered-By header
      hidePoweredBy: true,
      // Prevent MIME type sniffing
      noSniff: true,
      // XSS filter
      xssFilter: true,
      // HSTS (in production only)
      hsts: isProduction
        ? { maxAge: 31536000, includeSubDomains: true }
        : false,
    }),
  );

  // CORS configuration
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
  app.enableCors({
    origin: isProduction
      ? frontendUrl
      : [frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 86400, // 24 hours
  });

  // Global exception filter for standardized error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global response interceptor for standardized success responses
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new LoggingInterceptor(app.get(WINSTON_MODULE_NEST_PROVIDER)),
  );

  // Global validation pipes with security options
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // Strip properties that are not in the DTO
      forbidNonWhitelisted: true,  // Throw error if non-whitelisted properties are present
      transform: true,              // Transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: isProduction,
    }),
    new SanitizePipe(), // Sanitize all string inputs to prevent XSS
  );

  // Trust proxy (for correct IP detection behind reverse proxy)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // Swagger API Documentation (disable in production for security)
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('Together Pray API')
      .setDescription('기도 공동체 웹앱 REST API 문서')
      .setVersion('2.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'JWT 토큰을 입력하세요',
          in: 'header',
        },
        'access-token',
      )
      .addTag('auth', '인증 관련 API')
      .addTag('users', '사용자 관련 API')
      .addTag('groups', '그룹 관련 API')
      .addTag('prayer-items', '기도 제목 관련 API')
      .addTag('prayer-updates', '기도 업데이트 관련 API')
      .addTag('prayer-reactions', '기도 반응 관련 API')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
  logger.log(`Environment: ${configService.get('NODE_ENV', 'development')}`, 'Bootstrap');
  if (!isProduction) {
    logger.log(`Swagger documentation: http://localhost:${port}/api/docs`, 'Bootstrap');
  }
}
bootstrap();
