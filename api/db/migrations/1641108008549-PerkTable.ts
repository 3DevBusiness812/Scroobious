import { MigrationInterface, QueryRunner } from 'typeorm';

export class PerkTable1641108008549 implements MigrationInterface {
  name = 'PerkTable1641108008549';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "perk" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "company_name" character varying NOT NULL, "company_bio" character varying NOT NULL, "description" character varying NOT NULL, "category" character varying NOT NULL, "url" character varying NOT NULL, "logo_file" character varying NOT NULL, CONSTRAINT "pk perk id" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "perk"`);
  }
}
