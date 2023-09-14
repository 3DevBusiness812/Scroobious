import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourseProduct1638677246067 implements MigrationInterface {
  name = 'CourseProduct1638677246067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "course_product" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "course_id" character varying NOT NULL, "product_id" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'AVAILABLE', CONSTRAINT "pk course_product id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "course_product" ADD CONSTRAINT "fk course_product course_id" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "course_product" ADD CONSTRAINT "fk course_product product_id" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course_product" DROP CONSTRAINT "fk course_product product_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "course_product" DROP CONSTRAINT "fk course_product course_id"`
    );
    await queryRunner.query(`DROP TABLE "course_product"`);
  }
}
