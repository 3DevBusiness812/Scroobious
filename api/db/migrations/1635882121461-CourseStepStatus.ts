import {MigrationInterface, QueryRunner} from "typeorm";

export class CourseStepStatus1635882121461 implements MigrationInterface {
    name = 'CourseStepStatus1635882121461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_step" ADD "status" character varying NOT NULL DEFAULT 'COMPLETE'`);
        await queryRunner.query(`ALTER TABLE "course_step" ADD "course_step_definition_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_step" DROP COLUMN "course_step_definition_id"`);
        await queryRunner.query(`ALTER TABLE "course_step" DROP COLUMN "status"`);
    }

}
