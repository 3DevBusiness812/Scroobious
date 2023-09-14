import { MigrationInterface, QueryRunner } from 'typeorm';

export class PitchFeedbackDraftBoolean1648092640279 implements MigrationInterface {
  name = 'PitchFeedbackDraftBoolean1648092640279';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch_deck" ADD "draft" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch_deck" DROP COLUMN "draft"`);
  }
}
