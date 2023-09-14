import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActiveDevelopment1643869470271 implements MigrationInterface {
  name = 'ActiveDevelopment1643869470271';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "video_url"`);
    await queryRunner.query(
      `ALTER TABLE "password_reset" ADD CONSTRAINT "uq password_reset email" UNIQUE ("email")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "password_reset" DROP CONSTRAINT "uq password_reset email"`
    );
    await queryRunner.query(`ALTER TABLE "pitch" ADD "video_url" character varying`);
  }
}
