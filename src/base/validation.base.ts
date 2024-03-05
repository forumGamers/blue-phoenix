import * as yup from "yup";
import { RpcException } from "@nestjs/microservices";
import { Status } from "@grpc/grpc-js/build/src/constants";
import { isValidObjectId } from "mongoose";

export default abstract class BaseValidation {
  protected async validate<T = any>(schema: yup.Schema, data: any): Promise<T> {
    try {
      return (await schema.validate(data, {
        stripUnknown: true,
        abortEarly: false,
      })) as T;
    } catch (err) {
      const { errors } = err as { errors: string[] };

      throw new RpcException({
        message: errors.length ? errors.join(",\n ") : errors[0],
        code: Status.INVALID_ARGUMENT,
      });
    }
  }

  protected fileInputSchema = {
    header: yup.string().required("header is required"),
    contentType: yup.string().required("contentType is required"),
    size: yup.number().required("size is required"),
    content: yup
      .mixed()
      .required("content is required")
      .test("is content", "value must be buffer", (val) =>
        Buffer.isBuffer(val)
      ),
    filename: yup.string().optional().default("N/A"),
  };

  protected validateRequiredObjectId = (field: string) =>
    yup
      .string()
      .required(`${field} is required`)
      .test("is valid ObjectId", "invalid ObjectId", (val) =>
        isValidObjectId(val)
      );
}
