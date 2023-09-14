import {MigrationInterface, QueryRunner} from "typeorm";

export class CourseRemoveUserId1637899629487 implements MigrationInterface {
    name = 'CourseRemoveUserId1637899629487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "fk course pitch_id"`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "pitch_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "course" ADD CONSTRAINT "fk course organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course" ADD CONSTRAINT "fk course pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "fk course pitch_id"`);
        await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "fk course organization_id"`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "pitch_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "course" ADD CONSTRAINT "fk course pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course" ADD "user_id" character varying NOT NULL`);
    }

}
