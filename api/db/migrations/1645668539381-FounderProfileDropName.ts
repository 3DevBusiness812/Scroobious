import {MigrationInterface, QueryRunner} from "typeorm";

export class FounderProfileDropName1645668539381 implements MigrationInterface {
    name = 'FounderProfileDropName1645668539381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "founder_profile" ADD "name" character varying NOT NULL`);
    }

}
