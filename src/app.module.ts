import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { config } from "dotenv";
import { RoomModule } from "./modules/room/room.module";
import { UploadFileModule } from "./lib/imagekit.lib";

config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      waitQueueTimeoutMS: 1000 * 30,
    }),
    UploadFileModule.register({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_ENDPOINT_URL,
    }),
  ],
  controllers: [],
  providers: [RoomModule],
})
export class AppModule {}
