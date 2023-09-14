import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveElevatorPitch1649729389197 implements MigrationInterface {
  name = 'RemoveElevatorPitch1649729389197';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch" RENAME COLUMN "elevator" TO "short_description"`);
    await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "elevator"`);
    await queryRunner.query(
      `ALTER TABLE "investor_profile" ALTER COLUMN "linkedin_url" DROP NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "investor_profile" ALTER COLUMN "linkedin_url" SET NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "startup" ADD "elevator" character varying`);
    await queryRunner.query(`ALTER TABLE "pitch" RENAME COLUMN "short_description" TO "elevator"`);
  }
}
