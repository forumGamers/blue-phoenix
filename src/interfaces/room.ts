import type { FileInput } from ".";

export interface CreateRoomInput {
  users: string[];
  description?: string;
  name?: string;
  file?: FileInput | null;
}

export interface DeleteUserInput {
  userId: string;
  roomId: string;
}
