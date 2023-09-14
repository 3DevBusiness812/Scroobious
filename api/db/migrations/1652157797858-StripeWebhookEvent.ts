import { MigrationInterface, QueryRunner } from 'typeorm';

export class StripeWebhookEvent1652157797858 implements MigrationInterface {
  name = 'StripeWebhookEvent1652157797858';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stripe_webhook_event" ADD "status" character varying NOT NULL DEFAULT 'NEW'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stripe_webhook_event" DROP COLUMN "status"`);
  }
}
