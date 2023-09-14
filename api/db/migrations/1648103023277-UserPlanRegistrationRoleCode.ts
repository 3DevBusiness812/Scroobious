import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserPlanRegistrationRoleCode1648103023277 implements MigrationInterface {
  name = 'UserPlanRegistrationRoleCode1648103023277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_plan_registration" RENAME COLUMN "role_code" TO "user_type"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_plan_registration" RENAME COLUMN "user_type" TO "role_code"`
    );
  }
}
