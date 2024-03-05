import { type Metadata } from '@grpc/grpc-js';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { RpcException } from '@nestjs/microservices';

export default new (class Helper {
  public getUserFromMetadata(metadata: Metadata) {
    const UUID = metadata.get('UUID');
    const loggedAs = metadata.get('loggedAs');
    if (!UUID || !UUID.length || !loggedAs || !loggedAs.length)
      throw new RpcException({
        code: Status.INTERNAL,
        message: 'Internal Server Error',
      });

    return {
      UUID: UUID[0] as string,
      loggedAs: loggedAs[0] as string,
    };
  }
})();
