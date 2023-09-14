import { StringMap } from 'warthog';

export type UserContext = {
  id: string;
  capabilities: string[];
  image: string | undefined;
  name: string;
  email: string;
  status: string;
  permissions?: string[];
};

// export type TokenContext = UserContext & {
//   iat: number;
//   exp: number;
// };

export interface BaseContext {
  user: UserContext; // TokenContext
  request: {
    // TODO: figure out this type
    headers: StringMap;
  };
}
