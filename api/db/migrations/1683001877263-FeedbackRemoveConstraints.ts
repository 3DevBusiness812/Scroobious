import { MigrationInterface, QueryRunner } from 'typeorm';

export class FeedbackRemoveConstraints1683001877263 implements MigrationInterface {
  name = 'FeedbackRemoveConstraints1683001877263';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" DROP CONSTRAINT "uq pitch_meeting_feedback recording_file_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "uq pitch_written_feedback original_pitch_deck_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "uq pitch_written_feedback reviewed_pitch_deck_id"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
        `ALTER TABLE "pitch_meeting_feedback" ADD CONSTRAINT "uq pitch_meeting_feedback recording_file_id" UNIQUE ("recording_file_id")`
    );
    await queryRunner.query(
        `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "uq pitch_written_feedback original_pitch_deck_id" UNIQUE ("original_pitch_deck_id")`
    );
    await queryRunner.query(
        `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "uq pitch_written_feedback reviewed_pitch_deck_id" UNIQUE ("reviewed_pitch_deck_id")`
    );
  }
}
