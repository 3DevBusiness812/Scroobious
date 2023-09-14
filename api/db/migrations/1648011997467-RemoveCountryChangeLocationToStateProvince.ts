import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCountryChangeLocationToStateProvince1648011997467 implements MigrationInterface {
  name = 'RemoveCountryChangeLocationToStateProvince1648011997467';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "founder_profile" RENAME COLUMN "location" TO "state_province"`
    );
    await queryRunner.query(
      `ALTER TABLE "investor_profile" RENAME COLUMN "location" TO "state_province"`
    );
    await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "country"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "startup" ADD "country" character varying`);
    await queryRunner.query(
      `ALTER TABLE "investor_profile" RENAME COLUMN "state_province" TO "location"`
    );
    await queryRunner.query(
      `ALTER TABLE "founder_profile" RENAME COLUMN "state_province" TO "location"`
    );
  }
}
