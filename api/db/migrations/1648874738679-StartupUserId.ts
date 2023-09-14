import { MigrationInterface, QueryRunner } from 'typeorm';

export class StartupUserId1648874738679 implements MigrationInterface {
  name = 'StartupUserId1648874738679';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "startup" ADD "user_id" character varying;
            UPDATE "startup" SET "user_id" = "created_at";
            ALTER TABLE "startup" ALTER COLUMN "user_id" SET NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "user_id"`);
  }
}
