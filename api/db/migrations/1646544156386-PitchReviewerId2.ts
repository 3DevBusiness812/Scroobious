import { MigrationInterface, QueryRunner } from 'typeorm';

export class PitchReviewerId21646544156386 implements MigrationInterface {
  name = 'PitchReviewerId21646544156386';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "fk pitch_written_feedback pitch_deck_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ALTER COLUMN "pitch_deck_id" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback pitch_deck_id" FOREIGN KEY ("pitch_deck_id") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "fk pitch_written_feedback pitch_deck_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ALTER COLUMN "pitch_deck_id" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback pitch_deck_id" FOREIGN KEY ("pitch_deck_id") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
