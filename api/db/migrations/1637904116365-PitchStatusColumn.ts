import {MigrationInterface, QueryRunner} from "typeorm";

export class PitchStatusColumn1637904116365 implements MigrationInterface {
    name = 'PitchStatusColumn1637904116365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pitch" ADD "status" character varying NOT NULL DEFAULT 'DRAFT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "status"`);
    }

}
