import { type ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { config } from 'dotenv';

config();

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'room',
    protoPath: join(__dirname, '../proto/index.proto'),
    url: process.env.APPLICATION_URL ?? 'localhost:50055',
  },
};
