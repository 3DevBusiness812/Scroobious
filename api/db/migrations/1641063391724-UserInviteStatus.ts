import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserInviteStatus1641063391724 implements MigrationInterface {
  name = 'UserInviteStatus1641063391724';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_invite" ADD "status" character varying NOT NULL DEFAULT 'OPEN'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_invite" DROP COLUMN "status"`);
  }
}
