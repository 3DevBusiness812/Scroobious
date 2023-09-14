import {MigrationInterface, QueryRunner} from "typeorm";

export class ActiveDevelopment1666214772587 implements MigrationInterface {
    name = 'ActiveDevelopment1666214772587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "founder_profile" ADD "company_stage" character varying`);
        await queryRunner.query(`ALTER TABLE "founder_profile" ADD "funding_status" character varying`);
        await queryRunner.query(`ALTER TABLE "founder_profile" ADD "industry" character varying array`);
        await queryRunner.query(`ALTER TABLE "founder_profile" ADD "presentation_status" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "presentation_status"`);
        await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "industry"`);
        await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "funding_status"`);
        await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "company_stage"`);
    }

}
