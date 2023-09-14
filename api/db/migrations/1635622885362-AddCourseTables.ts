import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCourseTables1635622885362 implements MigrationInterface {
  name = 'AddCourseTables1635622885362';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "course_definition" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "pk course_definition id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "course_step_definition" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "name" character varying NOT NULL, "section" character varying NOT NULL, "description" character varying NOT NULL, "type" character varying NOT NULL, "sequence_num" integer NOT NULL, "config" jsonb NOT NULL, CONSTRAINT "pk course_step_definition id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "course" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'NOT_STARTED', "course_type_id" character varying NOT NULL, "current_step" character varying NOT NULL, "step_data" jsonb NOT NULL, CONSTRAINT "pk course id" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "course"`);
    await queryRunner.query(`DROP TABLE "course_step_definition"`);
    await queryRunner.query(`DROP TABLE "course_definition"`);
  }
}
