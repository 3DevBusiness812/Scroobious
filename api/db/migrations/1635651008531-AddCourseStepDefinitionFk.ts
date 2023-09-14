import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCourseStepDefinitionFk1635651008531 implements MigrationInterface {
    name = 'AddCourseStepDefinitionFk1635651008531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_step_definition" ADD "course_definition_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "course_step_definition" ADD CONSTRAINT "fk course_step_definition course_definition_id" FOREIGN KEY ("course_definition_id") REFERENCES "course_definition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_step_definition" DROP CONSTRAINT "fk course_step_definition course_definition_id"`);
        await queryRunner.query(`ALTER TABLE "course_step_definition" DROP COLUMN "course_definition_id"`);
    }

}
