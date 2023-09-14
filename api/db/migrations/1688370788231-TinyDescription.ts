import { MigrationInterface, QueryRunner } from 'typeorm';

export class TinyDescription1688370788231 implements MigrationInterface {
  name = 'TinyDescription1688370788231';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "startup" ADD "tiny_description" character varying DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "tiny_description"`);
  }
}
