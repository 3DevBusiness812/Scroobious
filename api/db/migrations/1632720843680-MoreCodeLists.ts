import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoreCodeLists1632720843680 implements MigrationInterface {
  name = 'MoreCodeLists1632720843680';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "company_role" ("id" character varying NOT NULL, "description" character varying NOT NULL, "archived" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, CONSTRAINT "pk company_role id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "corporate_structure" ("id" character varying NOT NULL, "description" character varying NOT NULL, "archived" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, CONSTRAINT "pk corporate_structure id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "country" ("id" character varying NOT NULL, "description" character varying NOT NULL, "archived" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, CONSTRAINT "pk country id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "presentation_status" ("id" character varying NOT NULL, "description" character varying NOT NULL, "archived" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, CONSTRAINT "pk presentation_status id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "working_status" ("id" character varying NOT NULL, "description" character varying NOT NULL, "archived" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, CONSTRAINT "pk working_status id" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "working_status"`);
    await queryRunner.query(`DROP TABLE "presentation_status"`);
    await queryRunner.query(`DROP TABLE "country"`);
    await queryRunner.query(`DROP TABLE "corporate_structure"`);
    await queryRunner.query(`DROP TABLE "company_role"`);
  }
}
