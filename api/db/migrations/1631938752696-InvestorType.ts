import { MigrationInterface, QueryRunner } from 'typeorm';

export class InvestorType1631938752696 implements MigrationInterface {
  name = 'InvestorType1631938752696';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "investor_type" ("id" character varying NOT NULL, "description" character varying NOT NULL, "archived" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, CONSTRAINT "pk investor_type id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "accreditation_status" DROP COLUMN "code"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accreditation_status" ADD "code" character varying NOT NULL`
    );
    await queryRunner.query(`DROP TABLE "investor_type"`);
  }
}
