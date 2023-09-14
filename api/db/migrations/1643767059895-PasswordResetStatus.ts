import { MigrationInterface, QueryRunner } from 'typeorm';

export class PasswordResetStatus1643767059895 implements MigrationInterface {
  name = 'PasswordResetStatus1643767059895';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "password_reset" ADD "status" character varying NOT NULL DEFAULT 'OPEN'`
    );
    await queryRunner.query(
      `ALTER TABLE "password_reset" ADD CONSTRAINT "uq password_reset token" UNIQUE ("token")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "password_reset" DROP CONSTRAINT "uq password_reset token"`
    );
    await queryRunner.query(`ALTER TABLE "password_reset" DROP COLUMN "status"`);
  }
}
