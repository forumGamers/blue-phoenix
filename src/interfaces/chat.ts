import type { FileInput } from ".";

export interface CreateChatInput {
  roomId: string;
  message?: string;
  file?: FileInput | null;
}

export interface SetReadInput {
  roomId: string;
  chatIds: string[];
}
