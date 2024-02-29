import  Imagekit from 'imagekit';
import {
  Injectable,
  Module,
  type DynamicModule,
  type Provider,
} from '@nestjs/common';
import type { UploadResponse } from '../interfaces/imagekit';
import { config } from 'dotenv';

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

export const UPLOAD_SERVICE_PROVIDER = 'UPLOAD_SERVICE_PROVIDER';

@Injectable()
export class UploadFileService {
  private readonly ik: Imagekit;
  constructor(private readonly options: ImageKitOptions) {
    this.ik = new Imagekit(options);
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

@Module({})
export class UploadFileModule {
  public static register(options: ImageKitOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: UPLOAD_SERVICE_PROVIDER,
        useValue: options,
      },
      {
        provide: UploadFileService,
        useFactory: (options: ImageKitOptions) =>
          new UploadFileService(options),
        inject: [UPLOAD_SERVICE_PROVIDER],
      },
    ];

    return {
      module: UploadFileModule,
      providers: providers,
      exports: providers,
    };
  }
}
