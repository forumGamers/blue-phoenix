import { Controller, UseInterceptors } from "@nestjs/common";
import { GrpcMethod, RpcException } from "@nestjs/microservices";
import { ROOM_SERVICE } from "../../constants/room.constant";
import { ROOM_SERVICE_METHOD } from "../../enum/room.enum";
import { AuthenticationInterceptor } from "../../middlewares/authentication.middleware";
import type { Metadata } from "@grpc/grpc-js";
import { RoomService } from "./room.service";
import { RoomValidator } from "./room.validation";
import type { RoomChatDocument } from "../../models/room.schema";
import { UploadFileService } from "../../lib/imagekit.lib";
import type { RoomRole } from "../../interfaces/schema";
import { Status } from "@grpc/grpc-js/build/src/constants";

@Controller()
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly roomValidation: RoomValidator,
    private readonly uploadFileService: UploadFileService
  ) {}

  @GrpcMethod(ROOM_SERVICE, ROOM_SERVICE_METHOD.CREATEROOM)
  @UseInterceptors(AuthenticationInterceptor)
  public async createRoom(data: any, metadata: Metadata) {
    const [UUID] = metadata.get("UUID") as string[];
    const {
      users,
      name,
      description,
      file,
    } = await this.roomValidation.validateCreateRoom(data);

    const payload: RoomChatDocument = {} as RoomChatDocument;
    if (users.length > 1) {
      payload.name = name ?? "No Name";
      payload.description = description ?? "";
      payload.owner = UUID;
      if (file) {
        const { fileId, url } = await this.uploadFileService.uploads({
          fileName: file.filename,
          folder: "roomImage",
          path: file.content,
        });

        payload.image = url;
        payload.imageId = fileId;
      }
    }

    payload.type = users.length > 1 ? "Group" : "Private";
    payload.users = [
      ...users
        .map((userId) => ({
          userId,
          addedAt: new Date(),
          role:
            userId === UUID && payload.type === "Group"
              ? "Admin"
              : ("Member" as RoomRole),
        }))
        .filter(({ userId }) => userId !== UUID),
      {
        userId: UUID,
        addedAt: new Date(),
        role: payload.type === "Group" ? "Admin" : "Member",
      },
    ];

    if (payload.users.length < 2)
      throw new RpcException({
        message: "There is no user",
        code: Status.ABORTED,
      }); //check if user input himself

    payload.chats = [];

    return await this.roomService.createRoom(payload);
  }
}
