import { Container as standardConfig } from 'typedi';
import { Database } from 'warthog';
import { MyStrategy } from './naming-strategy';
standardConfig.import([Database]);
const database = standardConfig.get('Database') as Database;

export const config = {
  ...database.getBaseConfig(),
  namingStrategy: new MyStrategy(),
};

// console.log('ormconfig config :>> ', config);

export default config;
