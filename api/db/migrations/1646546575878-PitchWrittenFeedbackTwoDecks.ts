import { MigrationInterface, QueryRunner } from 'typeorm';

export class PitchWrittenFeedbackTwoDecks1646546575878 implements MigrationInterface {
  name = 'PitchWrittenFeedbackTwoDecks1646546575878';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "fk pitch_written_feedback pitch_deck_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" RENAME COLUMN "assigned_reviewer_id" TO "reviewer_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "uq pitch_written_feedback pitch_deck_id"`
    );
    await queryRunner.query(`ALTER TABLE "pitch_written_feedback" DROP COLUMN "pitch_deck_id"`);
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD "original_pitch_deck_id" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "uq pitch_written_feedback original_pitch_deck_id" UNIQUE ("original_pitch_deck_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD "reviewed_pitch_deck_id" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "uq pitch_written_feedback reviewed_pitch_deck_id" UNIQUE ("reviewed_pitch_deck_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback original_pitch_deck_id" FOREIGN KEY ("original_pitch_deck_id") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback reviewed_pitch_deck_id" FOREIGN KEY ("reviewed_pitch_deck_id") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "fk pitch_written_feedback reviewed_pitch_deck_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "fk pitch_written_feedback original_pitch_deck_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "uq pitch_written_feedback reviewed_pitch_deck_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP COLUMN "reviewed_pitch_deck_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "uq pitch_written_feedback original_pitch_deck_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP COLUMN "original_pitch_deck_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD "pitch_deck_id" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "uq pitch_written_feedback pitch_deck_id" UNIQUE ("pitch_deck_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" RENAME COLUMN "reviewer_id" TO "assigned_reviewer_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback pitch_deck_id" FOREIGN KEY ("pitch_deck_id") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
