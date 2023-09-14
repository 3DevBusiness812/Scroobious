import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReaddCountryStartup1648098195612 implements MigrationInterface {
  name = 'ReaddCountryStartup1648098195612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "startup" ADD "country" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "country"`);
  }
}
