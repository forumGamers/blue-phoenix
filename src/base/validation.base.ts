import * as yup from "yup";
import { RpcException } from "@nestjs/microservices";
import { Status } from "@grpc/grpc-js/build/src/constants";
import { encodingFile, mimetypeFile } from "../constants";

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
    fieldname: yup.string().optional().default("N/A"),
    originalname: yup.string().optional().default("N/A"),
    encoding: yup
      .string()
      .required("encoding is required")
      .oneOf(Object.values(encodingFile), "Invalid Encoding"),
    mimetype: yup
      .string()
      .required("mimetype is required")
      .oneOf(Object.values(mimetypeFile), "Invalid Mimetype"),
    size: yup.number().required("size is required"),
    buffer: yup
      .mixed()
      .required("buffer is required")
      .test("is buffer", "value must be buffer", (val) => Buffer.isBuffer(val)),
    filename: yup.string().optional().default("N/A"),
  };
}
