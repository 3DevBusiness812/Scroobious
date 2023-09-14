import {MigrationInterface, QueryRunner} from "typeorm";

export class ActiveDevelopment1666381450596 implements MigrationInterface {
    name = 'ActiveDevelopment1666381450596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "company_roles"`);
        await queryRunner.query(`ALTER TABLE "founder_profile" ADD "company_roles" character varying array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "company_roles"`);
        await queryRunner.query(`ALTER TABLE "founder_profile" ADD "company_roles" character varying`);
    }

}
