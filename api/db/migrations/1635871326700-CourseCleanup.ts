import {MigrationInterface, QueryRunner} from "typeorm";

export class CourseCleanup1635871326700 implements MigrationInterface {
    name = 'CourseCleanup1635871326700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "course_type_id"`);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "step_data"`);
        await queryRunner.query(`ALTER TABLE "course" ADD "course_definition_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "course" ADD CONSTRAINT "fk course course_definition_id" FOREIGN KEY ("course_definition_id") REFERENCES "course_definition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "fk course course_definition_id"`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED'`);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "course_definition_id"`);
        await queryRunner.query(`ALTER TABLE "course" ADD "step_data" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "course" ADD "course_type_id" character varying NOT NULL`);
    }

}
