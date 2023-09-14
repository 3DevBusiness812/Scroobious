import { MigrationInterface, QueryRunner } from 'typeorm';

export class BusinessChallengeMoveToStartup1644634636082 implements MigrationInterface {
  name = 'BusinessChallengeMoveToStartup1644634636082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "business_challenge"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "presentation_status"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "anything_else"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "desired_support"`);
    await queryRunner.query(`ALTER TABLE "startup" ADD "business_challenge" character varying`);
    await queryRunner.query(`ALTER TABLE "startup" ADD "presentation_status" character varying`);
    await queryRunner.query(`ALTER TABLE "startup" ADD "desired_support" character varying`);
    await queryRunner.query(`ALTER TABLE "startup" ADD "anything_else" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "anything_else"`);
    await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "desired_support"`);
    await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "presentation_status"`);
    await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "business_challenge"`);
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "desired_support" character varying`
    );
    await queryRunner.query(`ALTER TABLE "founder_profile" ADD "anything_else" character varying`);
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "presentation_status" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "business_challenge" character varying`
    );
  }
}
