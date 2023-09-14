import {MigrationInterface, QueryRunner} from "typeorm";

export class ActiveDevelopment1669069658981 implements MigrationInterface {
    name = 'ActiveDevelopment1669069658981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT 'INACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT 'ONBOARDING'`);
    }

}
