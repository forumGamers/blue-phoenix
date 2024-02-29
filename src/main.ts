import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { LoggerInterceptor } from "./middlewares/logger.middlewares";
import { grpcClientOpts } from "./config/grpc.config";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, grpcClientOpts);

  app.useGlobalInterceptors(new LoggerInterceptor());
  await app.listen();
}
bootstrap();
