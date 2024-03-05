import Imagekit from "imagekit";
import { Injectable } from "@nestjs/common";
import type { UploadResponse } from "../interfaces/imagekit";
import { config } from "dotenv";

config();

export type UploadImgProps = {
  path: string | Buffer;
  fileName: string;
  folder: string;
};

export interface ImageKitOptions {
  publicKey: string;
  privateKey: string;
  urlEndpoint: string;
}

@Injectable()
export class UploadFileService {
  private readonly ik: Imagekit;
  constructor() {
    this.ik = new Imagekit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_ENDPOINT_URL,
    });
  }

  public uploads = async ({
    path,
    fileName,
    folder,
  }: UploadImgProps): Promise<UploadResponse> =>
    await this.ik.upload({
      file: path,
      fileName,
      folder,
    });
}
