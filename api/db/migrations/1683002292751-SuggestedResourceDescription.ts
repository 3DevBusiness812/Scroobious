import { MigrationInterface, QueryRunner } from 'typeorm';

export class SuggestedResourceDescription1683002292751 implements MigrationInterface {
  name = 'SuggestedResourceDescription1683002292751';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "suggested_resource" ADD "description" character varying DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "suggested_resource" DROP COLUMN "description"`);
  }
}
