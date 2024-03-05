import { Controller } from "@nestjs/common";
import { GrpcMethod, RpcException } from "@nestjs/microservices";
import { ROOM_SERVICE } from "../../constants/room.constant";
import { ROOM_SERVICE_METHOD } from "../../enum/room.enum";
import type { Metadata } from "@grpc/grpc-js";
import { RoomService } from "./room.service";
import { RoomValidator } from "./room.validation";
import type { RoomChatDocument } from "../../models/room.schema";
import { UploadFileService } from "../../lib/imagekit.lib";
import type { RoomRole } from "../../interfaces/schema";
import { Status } from "@grpc/grpc-js/build/src/constants";
import helpers from "../../helpers";
import { Types,type UpdateQuery } from "mongoose";

@Controller()
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly roomValidation: RoomValidator,
    private readonly uploadFileService: UploadFileService
  ) {}

  @GrpcMethod(ROOM_SERVICE, ROOM_SERVICE_METHOD.CREATEROOM)
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

  @GrpcMethod(ROOM_SERVICE, ROOM_SERVICE_METHOD.DELETEUSER)
  public async deleteUser(payload: any, metadata: Metadata) {
    const { UUID } = helpers.getUserFromMetadata(metadata);
    const { roomId, userId } = await this.roomValidation.validateDeleteUser(
      payload
    );

    if (UUID === userId)
      throw new RpcException({
        message: "cannot self delete",
        code: Status.PERMISSION_DENIED,
      });

    const roomObjectId = new Types.ObjectId(roomId);

    const data = await this.roomService.findById(roomObjectId);
    if (!data)
      throw new RpcException({
        message: "data not found",
        code: Status.NOT_FOUND,
      });

    if (
      data.users.find((el) => el.userId === UUID)?.role !== "Admin" ||
      data.owner !== UUID ||
      data.type === "Private"
    )
      throw new RpcException({
        message: "Forbidden",
        code: Status.PERMISSION_DENIED,
      });

    const user = data.users.find((user) => user.userId === userId);
    if (!user)
      throw new RpcException({
        message: "User not found",
        code: Status.NOT_FOUND,
      });

    if (
      data.users.find((el) => el.userId === user.userId)?.role === "Admin" &&
      data.owner !== UUID
    )
      throw new RpcException({
        message: "Cannot delete admin",
        code: Status.PERMISSION_DENIED,
      });

    await this.roomService.pullUser(roomObjectId, userId);

    return { message: "success" };
  }

  @GrpcMethod(ROOM_SERVICE, ROOM_SERVICE_METHOD.LEAVEROOM)
  public async leaveRoom(payload: any, metadata: Metadata) {
    const { UUID } = helpers.getUserFromMetadata(metadata);
    const { roomId } = await this.roomValidation.validateRoomId(payload);

    const roomObjectId = new Types.ObjectId(roomId);

    const data = await this.roomService.findById(roomObjectId);
    if (!data)
      throw new RpcException({
        message: "data not found",
        code: Status.NOT_FOUND,
      });

    if (data.type === "Private")
      throw new RpcException({
        message: "cannot leave private room",
        code: Status.PERMISSION_DENIED,
      });

      const query: UpdateQuery<RoomChatDocument> = {
        $pull: {
          users: {
            userId: UUID,
          },
        },
      };

      if (data.owner === UUID) {
        for (let i = data.users.length - 1; i >= 0; i--)
          if (data.users[i].role === "Admin") {
            query.$set = {
              owner: data.users[i].userId,
            };
            break;
          }

        if (!query.$set)
          throw new RpcException({
            message: "please set a admin first",
            code: Status.ABORTED,
          });
      }

    await this.roomService.updateByQuery(roomObjectId,query)

    return { message: "success" };
  }
}
