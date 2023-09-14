import { MigrationInterface, QueryRunner } from 'typeorm';

export class InvestorProfileAdditionalFields1643783343461 implements MigrationInterface {
  name = 'InvestorProfileAdditionalFields1643783343461';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "investor_profile" ADD "company_stages" character varying array`
    );
    await queryRunner.query(
      `ALTER TABLE "investor_profile" ADD "funding_statuses" character varying array`
    );
    await queryRunner.query(
      `ALTER TABLE "investor_profile" ADD "revenues" character varying array`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investor_profile" DROP COLUMN "revenues"`);
    await queryRunner.query(`ALTER TABLE "investor_profile" DROP COLUMN "funding_statuses"`);
    await queryRunner.query(`ALTER TABLE "investor_profile" DROP COLUMN "company_stages"`);
  }
}
