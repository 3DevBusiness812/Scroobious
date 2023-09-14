import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserLastLoginAt1642485161334 implements MigrationInterface {
  name = 'UserLastLoginAt1642485161334';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "last_login_at" TIMESTAMP WITH TIME ZONE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_login_at"`);
  }
}
