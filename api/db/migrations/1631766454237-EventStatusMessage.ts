import {MigrationInterface, QueryRunner} from "typeorm";

export class EventStatusMessage1631766454237 implements MigrationInterface {
    name = 'EventStatusMessage1631766454237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "status_message" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "status_message"`);
    }

}
