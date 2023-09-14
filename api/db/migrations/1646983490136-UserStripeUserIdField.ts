import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserStripeUserIdField1646983490136 implements MigrationInterface {
  name = 'UserStripeUserIdField1646983490136';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "stripe_user_id" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "stripe_user_id"`);
  }
}
