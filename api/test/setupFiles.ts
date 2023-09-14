import 'reflect-metadata';
import { Container } from 'typedi';
import { useContainer as typeOrmUseContainer } from 'typeorm';
// import { setTestServerEnvironmentVariables } from '../test/server-vars';

if (!(global as any).__test_harness_loaded__) {
  // Tell TypeORM to use our typedi instance
  typeOrmUseContainer(Container);

  // setTestServerEnvironmentVariables();

  (global as any).__test_harness_loaded__ = true;
}
