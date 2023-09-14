import { MigrationInterface, QueryRunner } from 'typeorm';

export class PitchUserStatusNotification1692280299417 implements MigrationInterface {
  name = 'PitchUserStatusNotification1692280299417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch_user_status" ADD COLUMN "notified" BOOLEAN NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch_user_status" DROP COLUMN "notified"`);
  }
}
