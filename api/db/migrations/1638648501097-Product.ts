import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActiveDevelopment1638648501097 implements MigrationInterface {
  name = 'ActiveDevelopment1638648501097';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "pk product id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "course_definition_product" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "course_definition_id" character varying NOT NULL, "product_id" character varying NOT NULL, CONSTRAINT "pk course_definition_product id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "course_definition_product" ADD CONSTRAINT "fk course_definition_product course_definition_id" FOREIGN KEY ("course_definition_id") REFERENCES "course_definition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "course_definition_product" ADD CONSTRAINT "fk course_definition_product product_id" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course_definition_product" DROP CONSTRAINT "fk course_definition_product product_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "course_definition_product" DROP CONSTRAINT "fk course_definition_product course_definition_id"`
    );
    await queryRunner.query(`DROP TABLE "course_definition_product"`);
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
