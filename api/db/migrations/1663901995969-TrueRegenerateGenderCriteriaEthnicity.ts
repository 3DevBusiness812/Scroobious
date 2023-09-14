import { MigrationInterface, QueryRunner } from 'typeorm';

export class TrueRegenerateGenderCriteriaEthnicity1663901995969 implements MigrationInterface {
  name = 'TrueRegenerateGenderCriteriaEthnicity1663901995969';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "criteria" ("id" character varying NOT NULL, "description" character varying NOT NULL, "archived" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, CONSTRAINT "pk criteria id" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "criteria"`);
  }
}
