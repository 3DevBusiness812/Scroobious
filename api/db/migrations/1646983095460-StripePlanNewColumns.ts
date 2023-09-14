import { MigrationInterface, QueryRunner } from 'typeorm';

export class StripePlanNewColumns1646983095460 implements MigrationInterface {
  name = 'StripePlanNewColumns1646983095460';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plan" ADD "stripe_plan_subscription_id" character varying NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "plan" ADD "status" character varying`);
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" ADD CONSTRAINT "fk pitch_meeting_feedback reviewer_id" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" DROP CONSTRAINT "fk pitch_meeting_feedback reviewer_id"`
    );
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "stripe_plan_subscription_id"`);
  }
}
