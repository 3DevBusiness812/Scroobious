import {MigrationInterface, QueryRunner} from "typeorm";

export class InvestorProfileAccreditationStatusPluralize1632198022272 implements MigrationInterface {
    name = 'InvestorProfileAccreditationStatusPluralize1632198022272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investor_profile" RENAME COLUMN "accreditation_status" TO "accreditation_statuses"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investor_profile" RENAME COLUMN "accreditation_statuses" TO "accreditation_status"`);
    }

}
