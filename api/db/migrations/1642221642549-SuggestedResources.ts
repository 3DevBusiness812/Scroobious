import { MigrationInterface, QueryRunner } from 'typeorm';

export class SuggestedResources1642221642549 implements MigrationInterface {
  name = 'SuggestedResources1642221642549';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "suggested_resource" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "company_name" character varying NOT NULL, "suggested_resource_category_id" character varying NOT NULL, "url" character varying NOT NULL, "logo_file_id" character varying NOT NULL, CONSTRAINT "rc suggested_resource logo_file_id" UNIQUE ("logo_file_id"), CONSTRAINT "pk suggested_resource id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "suggested_resource_category" ("id" character varying NOT NULL, "description" character varying NOT NULL, "archived" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, CONSTRAINT "pk suggested_resource_category id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "suggested_resource" ADD CONSTRAINT "fk suggested_resource suggested_resource_category_id" FOREIGN KEY ("suggested_resource_category_id") REFERENCES "suggested_resource_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "suggested_resource" ADD CONSTRAINT "fk suggested_resource logo_file_id" FOREIGN KEY ("logo_file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "suggested_resource" DROP CONSTRAINT "fk suggested_resource logo_file_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "suggested_resource" DROP CONSTRAINT "fk suggested_resource suggested_resource_category_id"`
    );
    await queryRunner.query(`DROP TABLE "suggested_resource_category"`);
    await queryRunner.query(`DROP TABLE "suggested_resource"`);
  }
}
