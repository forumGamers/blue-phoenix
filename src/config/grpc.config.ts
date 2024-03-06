import { type ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { config } from 'dotenv';

config();

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['room', 'chat', 'global'],
    protoPath: [
      join(__dirname, '../proto/room.proto'),
      join(__dirname, '../proto/chat.proto'),
      join(__dirname, '../proto/global.proto'),
    ],
    url: process.env.APPLICATION_URL ?? 'localhost:50055',
  },
};
