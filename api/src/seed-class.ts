import { Container } from 'typedi';
import { Connection, useContainer as TypeORMUseContainer } from 'typeorm';
import { Database } from 'warthog';
import { ConfigService, getContainer, Logger } from '../src/core';
import { getDBConnection } from './db/connection';
import { User } from './modules';
import { UserService } from './modules/identity/user/user.service';

TypeORMUseContainer(Container);

export class SeedClass {
  adminUser!: User;
  database: Database;
  dbConnection?: Connection;
  systemUser!: User;
  loaded = false;
  logger: Logger;
  configService: ConfigService;
  userService?: UserService;

  constructor() {
    this.database = getContainer(Database);
    this.logger = getContainer(Logger);
    this.configService = getContainer(ConfigService);

    return this;
  }

  async establishDBConnection() {
    try {
      return (this.dbConnection = await getDBConnection());
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async load() {
    if (this.loaded) {
      return;
    }

    this.userService = getContainer(UserService);

    try {
      this.systemUser = await this.userService.register({
        type: 'ADMIN',
        name: 'System User',
        profilePictureFileId: 'fake-image',
        email: 'system-user@pivot.com',
        password: 'fakepassword',
        confirmPassword: 'fakepassword',
      });
    } catch (error) {
      this.systemUser = await this.userService.findOne({ email: 'system-user@pivot.com' });
    }

    try {
      this.adminUser = await this.userService.register({
        type: 'ADMIN',
        name: 'Admin User',
        profilePictureFileId: 'fake-image',
        email: 'admin@pivot.com',
        password: 'fakepassword',
        confirmPassword: 'fakepassword',
      });
    } catch (error) {
      this.adminUser = await this.userService.findOne({ email: 'admin@pivot.com' });
      // console.log('this.adminUser :>> ', this.adminUser);
    }

    // console.log(this.systemUser);

    // const loginResponse = await this.userService.login({
    //   email: 'admin@user.com',
    //   password: 'foobar'
    // });

    // this.logger.debug('loginResponse :>> ', loginResponse);

    // this.adminUser = await this.userService.find({ where: { email: 'admin@user.com' } });

    // this.logger.debug('this.adminUser :>> ', this.adminUser);

    this.loaded = true;
  }
}
