import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActiveDevelopment1647488971443 implements MigrationInterface {
  name = 'ActiveDevelopment1647488971443';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE "user_plan_registration" ADD "role_code" character varying;
          UPDATE "user_plan_registration" SET "role_code" = 'FOUNDER_FULL';
          ALTER TABLE "user_plan_registration" ALTER COLUMN "role_code" SET NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_plan_registration" DROP COLUMN "role_code"`);
  }
}
