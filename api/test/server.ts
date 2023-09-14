import * as Debug from 'debug';
import { Service } from 'typedi';
import { Server } from 'warthog';
import { Binding } from '../generated/binding';
import { getContainer } from '../src/core';
import { UserService } from '../src/modules/identity/user/user.service';
import { getServer } from '../src/server';

const debug = Debug.debug('warthog:config');

@Service('TestServerService')
export class TestServerService {
  server: Server<any>;
  started = false;
  noAuthBinding: Binding;
  systemAdminAuthBinding: Binding;

  constructor() {
    this.server = getServer();
    return this;
  }

  // Returns a binding with no user token.
  // i.e. an unauthenticated user
  // This user can be used to register, login or call endpoints without authentication
  // to test that they're locked out
  async getNoAuthBinding() {
    if (!this.noAuthBinding) {
      this.noAuthBinding = (await this.server.getBinding()) as unknown as Binding;
    }
    return this.noAuthBinding;
  }

  async getSystemAdminAuthBinding() {
    if (!process.env.SCROOBIOUS_ADMIN_EMAIL) {
      throw new Error("Must set 'SCROOBIOUS_ADMIN_EMAIL' ENV var");
    }
    if (!process.env.SCROOBIOUS_ADMIN_DB_PASSWORD) {
      throw new Error("Must set 'SCROOBIOUS_ADMIN_DB_PASSWORD' ENV var");
    }

    const userService = getContainer(UserService);

    const result = await userService.login({
      email: process.env.SCROOBIOUS_ADMIN_EMAIL,
      password: process.env.SCROOBIOUS_ADMIN_DB_PASSWORD,
    });

    if (!this.systemAdminAuthBinding) {
      this.systemAdminAuthBinding = (await this.server.getBinding({
        token: result.token,
      })) as unknown as Binding;
    }
    return this.systemAdminAuthBinding;
  }

  async getBinding(token: string) {
    return this.server.getBinding({ token }) as unknown as Binding;
  }

  async start(): Promise<TestServerService> {
    if (!this.started) {
      try {
        await this.server.start();
      } catch (error) {
        console.error(error);
        throw new Error(error);
      }
      this.started = true;
    }

    return this;
  }

  async stop() {
    if (this.started) {
      try {
        await this.server.stop();
      } catch (error) {
        console.error(error);
      }
      this.started = false;
    }
  }
}
