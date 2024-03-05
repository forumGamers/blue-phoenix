import { Status } from "@grpc/grpc-js/build/src/constants";
import { RpcException } from "@nestjs/microservices";
import { JwtPayload, verify, decode, DecodeOptions } from "jsonwebtoken";

export interface jwtValue extends JwtPayload {
  UUID: string;
  loggedAs: "User" | "Admin" | "Seller";
}

export default new (class JWT {
  public verifyToken(token: string) {
    try {
      return verify(token, process.env.SECRET) as jwtValue;
    } catch (err) {
      throw new RpcException({
        message: "missing or invalid token",
        code: Status.UNAUTHENTICATED,
      });
    }
  }

  public decodeToken(token: string, opts?: DecodeOptions) {
    return decode(token, opts) as jwtValue;
  }
})();
