import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Model } from 'mongoose';
import type { RoomChatDocument } from '../../models/room.schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel('Room')
    private readonly roomRepo: Model<RoomChatDocument>,
  ) {}
}
