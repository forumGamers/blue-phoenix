import { Injectable } from "@nestjs/common";
import BaseValidation from "../../base/validation.base";
import * as yup from "yup";
import type { CreateRoomInput } from "../../interfaces/room";

@Injectable()
export class RoomValidator extends BaseValidation {
  public async validateCreateRoom(data: any) {
    return await this.validate<CreateRoomInput>(
      yup.object().shape({
        users: yup
          .array()
          .required("users is required")
          .transform((val: string) => val.split(","))
          .of(yup.string().uuid("invalid uuid"))
          .min(1)
          .test("unique value", "value must be unique", (val) =>
            !val ? true : new Set(val).size === val.length
          ),
        description: yup.string().optional().default(""),
        name: yup.string().optional(),
        file: yup.object().nullable().shape(this.fileInputSchema),
      }),
      data
    );
  }
}
