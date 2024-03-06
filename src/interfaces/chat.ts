import type { FileInput } from ".";

export interface CreateChatInput {
  roomId: string;
  message?: string;
  file?: FileInput | null;
}
