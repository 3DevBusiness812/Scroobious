import {MigrationInterface, QueryRunner} from "typeorm";

export class CoursePitchOneToOne1637897746360 implements MigrationInterface {
    name = 'CoursePitchOneToOne1637897746360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "course" ADD "pitch_id" character varying`);
        await queryRunner.query(`ALTER TABLE "course" ADD CONSTRAINT "uq course pitch_id" UNIQUE ("pitch_id")`);
        await queryRunner.query(`ALTER TABLE "course" ADD CONSTRAINT "fk course pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "fk course pitch_id"`);
        await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "uq course pitch_id"`);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "pitch_id"`);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "user_id"`);
    }

}
