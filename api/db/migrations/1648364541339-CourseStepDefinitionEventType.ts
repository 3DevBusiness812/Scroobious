import {MigrationInterface, QueryRunner} from "typeorm";

export class CourseStepDefinitionEventType1648364541339 implements MigrationInterface {
    name = 'CourseStepDefinitionEventType1648364541339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_step_definition" ADD "event_type" character varying`);
        await queryRunner.query(`ALTER TABLE "course_step" ADD CONSTRAINT "fk course_step course_step_definition_id" FOREIGN KEY ("course_step_definition_id") REFERENCES "course_step_definition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_step" DROP CONSTRAINT "fk course_step course_step_definition_id"`);
        await queryRunner.query(`ALTER TABLE "course_step_definition" DROP COLUMN "event_type"`);
    }

}
