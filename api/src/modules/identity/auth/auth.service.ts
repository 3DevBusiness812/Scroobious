// @ts-ignore
import { sign } from 'jsonwebtoken';
import SecurePassword from 'secure-password';
import { Service } from 'typedi';
import { Config } from 'warthog';

const SP = new SecurePassword();

@Service('AuthenticationService')
export class AuthenticationService {
  constructor(private readonly configService: Config) {}

  // signUser(user: UserContext) {
  //   const payload = { username: user.username, sub: user.id };
  //   return signToken(JSON.stringify(payload), this.configService.get('JWT_SECRET'));
  // }

  // See Blitz.js implementation
  // https://github.com/blitz-js/blitz/blob/63af540c879fe71dfad561d814b4da57dcafe576/examples/custom-server/app/auth/auth-utils.ts
  async hash(password: string) {
    if (typeof password !== 'string') {
      throw new Error(`Error Hashing password ${password}`);
    }

    const hashedBuffer = await SP.hash(Buffer.from(password));
    const hashedString = hashedBuffer.toString('base64');
    // console.log(`
    //   password :>> ${password}
    //   hashedBuffer :>> ${hashedBuffer}
    //   hashedString :>> ${hashedString}
    // `);
    return hashedString;
  }

  // See Blitz.js implementation
  // https://github.com/blitz-js/blitz/blob/63af540c879fe71dfad561d814b4da57dcafe576/examples/custom-server/app/auth/auth-utils.ts
  async verifyPassword(attempt: string, hashedPassword: string): Promise<boolean> {
    try {
      // console.log(`verifyPassword
      //   password: ${attempt}
      //   hashedPassword: ${hashedPassword}
      //   Buffer.from(password): ${Buffer.from(attempt)}
      //   Buffer.from(hashedPassword, 'base64'): ${Buffer.from(hashedPassword, 'base64')}
      // `);

      const hashVerifyResult = await SP.verify(
        Buffer.from(attempt),
        Buffer.from(hashedPassword, 'base64')
      );

      if (hashVerifyResult === SecurePassword.VALID) {
        return true;
      }

      // console.log('hashVerifyResult :>> ', hashVerifyResult);
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  sign(payload: object, expiresIn?: string | number) {
    expiresIn = expiresIn ?? this.configService.get('JWT_EXPIRATION');
    // console.log(`API sign JWT_SECRET`, this.configService.get('JWT_SECRET'));
    return sign(payload, this.configService.get('JWT_SECRET'), {
      expiresIn,
      algorithm: 'HS512',
    });
  }

  getTokenFromHeaders(headers: { authorization?: string }) {
    // TODO:
    // 1. Why do we need this?
    // 2. Need to incorporate the logic from server.ts as this will come in from the next-auth cookie
    if (!headers) {
      throw new Error('No headers found');
    }

    const authHeader = headers.authorization;
    if (!authHeader) {
      throw new Error('Authorizatin header missing');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid authorization header.  Must start with `Bearer `');
    }

    const token = authHeader.replace(/^Bearer /, '');
    if (!token) {
      throw new Error('Authorization header did not contain a token');
    }

    return token;
  }
}
