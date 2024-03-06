import { Injectable } from "@nestjs/common";
import BaseValidation from "../../base/validation.base";
import type { CreateChatInput } from "../../interfaces/chat";
import * as yup from "yup";

@Injectable()
export class ChatValidator extends BaseValidation {
  public async validateCreateChat(data: any) {
    return await this.validate<CreateChatInput>(
      yup
        .object()
        .shape({
          message: yup.string().optional(),
          roomId: this.validateRequiredObjectId("roomId"),
          file: yup.object().shape(this.fileInputSchema).optional(),
        })
        .test(
          "is valid input",
          "must provided message or file",
          ({ file, message }) => !!message || !!file
        ),
      data
    );
  }
}
