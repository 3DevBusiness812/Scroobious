import { MigrationInterface, QueryRunner } from 'typeorm';

export class InvestorSource1645252302818 implements MigrationInterface {
  name = 'InvestorSource1645252302818';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investor_profile" ADD "source" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investor_profile" DROP COLUMN "source"`);
  }
}
