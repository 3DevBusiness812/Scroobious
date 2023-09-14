import { MigrationInterface, QueryRunner } from 'typeorm';

export class PitchReviewerId1646538511728 implements MigrationInterface {
  name = 'PitchReviewerId1646538511728';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" RENAME COLUMN "assigned_reviewer_id" TO "reviewer_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback reviewer_id" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "fk pitch_written_feedback reviewer_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" RENAME COLUMN "reviewer_id" TO "assigned_reviewer_id"`
    );
  }
}
