import { Injectable } from "@nestjs/common";
import BaseValidation from "../../base/validation.base";
import type {
  CreateChatInput,
  SetReadInput,
  UpdateMsgInput,
} from "../../interfaces/chat";
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

  public async validateSetRead(data: any) {
    return await this.validate<SetReadInput>(
      yup.object().shape({
        roomId: this.validateRequiredObjectId("roomId"),
        chatIds: yup
          .array()
          .of(yup.string().required("ids is required"))
          .min(1, "minimum chatIds length is 1"),
      }),
      data
    );
  }

  public async validateEditMsg(data: any) {
    return await this.validate<UpdateMsgInput>(
      yup.object().shape({
        roomId: this.validateRequiredObjectId("roomId"),
        chatId: this.validateRequiredObjectId("chatId"),
        message: yup.string().required("message is required"),
      }),
      data
    );
  }
}
