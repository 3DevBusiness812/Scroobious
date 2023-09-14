import 'reflect-metadata';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { seed } from '../../seed';
import { isProduction } from '../helpers/environment';

export class developmentFakeData1735764508186 implements MigrationInterface {
  name = 'developmentFakeData1735764508186';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // console.log('developmentFakeData1735764508186');

    // Make sure all previous seed data is persisted before trying to use it this seed script
    // TBH not exactly sure why this is necessary.  One idea:
    // - One of the previous transactions has 2 START TRANSACTIONS and only 1 COMMIT, so things are staying open until the end
    if (queryRunner.isTransactionActive) {
      await queryRunner.commitTransaction();
      await queryRunner.startTransaction();
    }

    // console.log('process.env.WARTHOG_DB_URL :>> ', process.env.WARTHOG_DB_URL);

    // NODE_ENV === development for both development and test, so we need to check for both NODE_ENV
    const testMode = (process.env.WARTHOG_DB_URL || '').indexOf('-test') > -1;
    if (testMode) {
      return;
    }
    // console.log('testMode :>> ', testMode);

    const stagingMode = (process.env.WARTHOG_DB_URL || '').indexOf('_staging') > -1;
    // console.log('stagingMode :>> ', stagingMode);

    const developmentNodeEnv = process.env.NODE_ENV === 'development';
    // console.log('developmentNodeEnv :>> ', developmentNodeEnv);

    // We want to seed in both DEV and STAGING
    if (!isProduction()) {
      return seed(queryRunner.connection);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
