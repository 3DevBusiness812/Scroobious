import { MigrationInterface, QueryRunner } from 'typeorm';

export class StripeWebhookEvent1652157491587 implements MigrationInterface {
  name = 'StripeWebhookEvent1652157491587';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "stripe_webhook_event" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "type" character varying NOT NULL, "raw" jsonb NOT NULL, CONSTRAINT "pk stripe_webhook_event id" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "stripe_webhook_event"`);
  }
}
