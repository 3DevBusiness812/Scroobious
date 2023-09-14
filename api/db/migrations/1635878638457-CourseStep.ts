import {MigrationInterface, QueryRunner} from "typeorm";

export class CourseStep1635878638457 implements MigrationInterface {
    name = 'CourseStep1635878638457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "course_step" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "course_id" character varying NOT NULL, "data" jsonb NOT NULL, CONSTRAINT "pk course_step id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "course_step" ADD CONSTRAINT "fk course_step course_id" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_step" DROP CONSTRAINT "fk course_step course_id"`);
        await queryRunner.query(`DROP TABLE "course_step"`);
    }

}
