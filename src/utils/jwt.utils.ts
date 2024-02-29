import { JwtPayload, verify, decode, DecodeOptions } from "jsonwebtoken";

export interface jwtValue extends JwtPayload {
  UUID: string;
  loggedAs: "User" | "Admin" | "Seller";
}

export default new (class JWT {
  public verifyToken(token: string) {
    return verify(token, process.env.SECRET) as jwtValue;
  }

  public decodeToken(token: string, opts?: DecodeOptions) {
    return decode(token, opts) as jwtValue;
  }
})();
