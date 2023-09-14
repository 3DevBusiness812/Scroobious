import { MigrationInterface, QueryRunner } from 'typeorm';

export class PitchUpdates1640831827925 implements MigrationInterface {
  name = 'PitchUpdates1640831827925';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch" RENAME COLUMN "deck_url" TO "pitch_deck_id"`);
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" ADD "status" character varying NOT NULL DEFAULT 'REQUESTED'`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" ADD "product_id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD "status" character varying NOT NULL DEFAULT 'REQUESTED'`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD "product_id" character varying NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "pitch_deck" DROP CONSTRAINT "fk pitch_deck pitch_id"`);
    await queryRunner.query(`ALTER TABLE "pitch_deck" DROP CONSTRAINT "rc pitch_deck pitch_id"`);
    await queryRunner.query(
      `ALTER TABLE "pitch" ADD CONSTRAINT "uq pitch pitch_deck_id" UNIQUE ("pitch_deck_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" ADD CONSTRAINT "uq pitch_meeting_feedback recording_file_id" UNIQUE ("recording_file_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" ALTER COLUMN "course_id" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "uq pitch_written_feedback pitch_deck_id" UNIQUE ("pitch_deck_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ALTER COLUMN "course_id" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_deck" ADD CONSTRAINT "fk pitch_deck pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch" ADD CONSTRAINT "fk pitch pitch_deck_id" FOREIGN KEY ("pitch_deck_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" ADD CONSTRAINT "fk pitch_meeting_feedback pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" ADD CONSTRAINT "fk pitch_meeting_feedback product_id" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" ADD CONSTRAINT "fk pitch_meeting_feedback recording_file_id" FOREIGN KEY ("recording_file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" ADD CONSTRAINT "fk pitch_meeting_feedback course_id" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback product_id" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback pitch_deck_id" FOREIGN KEY ("pitch_deck_id") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback course_id" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "fk pitch_written_feedback course_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "fk pitch_written_feedback pitch_deck_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "fk pitch_written_feedback product_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "fk pitch_written_feedback pitch_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" DROP CONSTRAINT "fk pitch_meeting_feedback course_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" DROP CONSTRAINT "fk pitch_meeting_feedback recording_file_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" DROP CONSTRAINT "fk pitch_meeting_feedback product_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" DROP CONSTRAINT "fk pitch_meeting_feedback pitch_id"`
    );
    await queryRunner.query(`ALTER TABLE "pitch" DROP CONSTRAINT "fk pitch pitch_deck_id"`);
    await queryRunner.query(`ALTER TABLE "pitch_deck" DROP CONSTRAINT "fk pitch_deck pitch_id"`);
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ALTER COLUMN "course_id" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "uq pitch_written_feedback pitch_deck_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" ALTER COLUMN "course_id" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" DROP CONSTRAINT "uq pitch_meeting_feedback recording_file_id"`
    );
    await queryRunner.query(`ALTER TABLE "pitch" DROP CONSTRAINT "uq pitch pitch_deck_id"`);
    await queryRunner.query(
      `ALTER TABLE "pitch_deck" ADD CONSTRAINT "rc pitch_deck pitch_id" UNIQUE ("pitch_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_deck" ADD CONSTRAINT "fk pitch_deck pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(`ALTER TABLE "pitch_written_feedback" DROP COLUMN "product_id"`);
    await queryRunner.query(`ALTER TABLE "pitch_written_feedback" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "pitch_meeting_feedback" DROP COLUMN "product_id"`);
    await queryRunner.query(`ALTER TABLE "pitch_meeting_feedback" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "pitch" RENAME COLUMN "pitch_deck_id" TO "deck_url"`);
  }
}
