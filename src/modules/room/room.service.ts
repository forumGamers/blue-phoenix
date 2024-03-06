import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Model, Types, type UpdateQuery } from 'mongoose';
import type { RoomChatDocument } from '../../models/room.schema';
import type { ChatAttributes } from '../../interfaces/schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel('Room')
    private readonly roomRepo: Model<RoomChatDocument>,
  ) {}

  public async createRoom(data: RoomChatDocument) {
    return await this.roomRepo.create(data);
  }

  public async findById(id: Types.ObjectId | string) {
    return (await this.roomRepo.findById(id)) as RoomChatDocument | null;
  }

  public async pullUser(roomId: Types.ObjectId, userId: string) {
    return await this.roomRepo.findOneAndUpdate(
      { _id: roomId },
      { $pull: { users: { userId } } },
      {
        new: true,
      },
    );
  }

  public async updateByQuery(
    _id: Types.ObjectId,
    query: UpdateQuery<RoomChatDocument>,
  ) {
    return await this.roomRepo.findOneAndUpdate({ _id }, query, {
      new: true,
    });
  }

  public async updateUserRole(
    _id: Types.ObjectId,
    idx: number,
    status: 'Admin' | 'Member',
  ) {
    return await this.roomRepo.findOneAndUpdate(
      { _id },
      {
        $set: {
          [`users.${idx}.role`]: status,
        },
      },
      {
        new: true,
      },
    );
  }

  public async createChat(_id: Types.ObjectId, chat: ChatAttributes) {
    return await this.roomRepo.findOneAndUpdate(
      { _id },
      {
        $push: {
          chats: chat,
        },
      },
      {
        new: true,
      },
    );
  }
}
