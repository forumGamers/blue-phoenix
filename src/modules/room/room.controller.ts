import { Controller, UseInterceptors } from "@nestjs/common";
import { GrpcMethod, RpcException } from "@nestjs/microservices";
import { ROOM_SERVICE } from "../../constants/room.constant";
import { ROOM_SERVICE_METHOD } from "../../enum/room.enum";
import { AuthenticationInterceptor } from "../../middlewares/authentication.middleware";
import type { Metadata } from "@grpc/grpc-js";
import { RoomService } from "./room.service";
import { RoomValidator } from "./room.validation";
import type { RoomChatDocument } from "../../models/room.schema";

@Controller()
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly roomValidation: RoomValidator
  ) {}

  @GrpcMethod(ROOM_SERVICE, ROOM_SERVICE_METHOD.CREATEROOM)
  @UseInterceptors(AuthenticationInterceptor)
  public async createRoom(data: any, metadata: Metadata) {
    const [UUID] = metadata.get("UUID");
    const {
      users,
      name,
      description,
      file,
    } = await this.roomValidation.validateCreateRoom(data);

    const payload: RoomChatDocument = {} as RoomChatDocument;
    if (users.length > 1) {
      if (file) {
      }
    }
  }
}
