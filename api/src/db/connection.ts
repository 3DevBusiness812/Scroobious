// Note: Don't use @src (paths syntax) in this file as it's used by scripts that
// can't access paths
import 'reflect-metadata';
import { Container } from 'typedi';
import { Connection, ConnectionOptions, useContainer as TypeORMUseContainer } from 'typeorm';
import { Database } from 'warthog';
import { getContainer } from '../core';
import { MyStrategy } from './naming-strategy';
// import { MyStrategy } from './naming-strategy'

TypeORMUseContainer(Container);

const database: Database = getContainer(Database);

// Export this so that ormconfig can also use it
export const customDBConfig: Partial<ConnectionOptions> = {
  migrations: [], // Prevent "Cannot use import statement outside a module -> import {MigrationInterface, QueryRunner} from "typeorm";" issue
  namingStrategy: new MyStrategy(),
};

let connection: Connection;

export const getDBConnection = async () => {
  if (connection) {
    return connection;
  }

  return (connection = await database.createDBConnection(customDBConfig));
};
