import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { ROOM_PACKAGE } from "../../constants/room.constant";
import { grpcClientOpts } from "../../config/grpc.config";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";
import { MongooseModule } from "@nestjs/mongoose";
import { RoomChatSchema } from "../../models/room.schema";
import { RoomValidator } from "./room.validation";
import { UploadFileService } from "../../lib/imagekit.lib";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ROOM_PACKAGE,
        ...grpcClientOpts,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: "Room",
        schema: RoomChatSchema,
      },
    ]),
  ],
  providers: [RoomService, RoomValidator, UploadFileService],
  controllers: [RoomController],
})
export class RoomModule {}
