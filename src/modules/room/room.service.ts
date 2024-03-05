import { Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Model, Types, type UpdateQuery } from 'mongoose';
import type { RoomChatDocument } from '../../models/room.schema';

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
    );
  }

  public async updateByQuery(
    _id: Types.ObjectId,
    query: UpdateQuery<RoomChatDocument>,
  ) {
    return await this.roomRepo.findOneAndUpdate({ _id }, query);
  }

  public async updateUserRole(_id: Types.ObjectId, idx: number) {
    return await this.roomRepo.findOneAndUpdate(
      { _id },
      {
        $set: {
          [`users.${idx}.role`]: 'Admin',
        },
      },
    );
  }
}
