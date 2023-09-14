import { MigrationInterface, QueryRunner } from 'typeorm';

export class FeedbackCourseProductIdColumns1646105552600 implements MigrationInterface {
  name = 'FeedbackCourseProductIdColumns1646105552600';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" DROP CONSTRAINT "fk pitch_meeting_feedback course_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" DROP CONSTRAINT "fk pitch_meeting_feedback product_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "fk pitch_written_feedback course_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "fk pitch_written_feedback product_id"`
    );
    await queryRunner.query(`ALTER TABLE "pitch_meeting_feedback" DROP COLUMN "course_id"`);
    await queryRunner.query(`ALTER TABLE "pitch_meeting_feedback" DROP COLUMN "product_id"`);
    await queryRunner.query(`ALTER TABLE "pitch_written_feedback" DROP COLUMN "course_id"`);
    await queryRunner.query(`ALTER TABLE "pitch_written_feedback" DROP COLUMN "product_id"`);
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" ADD "course_product_id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD "course_product_id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" ADD CONSTRAINT "fk pitch_meeting_feedback course_product_id" FOREIGN KEY ("course_product_id") REFERENCES "course_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback course_product_id" FOREIGN KEY ("course_product_id") REFERENCES "course_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" DROP CONSTRAINT "fk pitch_written_feedback course_product_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" DROP CONSTRAINT "fk pitch_meeting_feedback course_product_id"`
    );
    await queryRunner.query(`ALTER TABLE "pitch_written_feedback" DROP COLUMN "course_product_id"`);
    await queryRunner.query(`ALTER TABLE "pitch_meeting_feedback" DROP COLUMN "course_product_id"`);
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD "product_id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD "course_id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" ADD "product_id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" ADD "course_id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback product_id" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback course_id" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" ADD CONSTRAINT "fk pitch_meeting_feedback product_id" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_meeting_feedback" ADD CONSTRAINT "fk pitch_meeting_feedback course_id" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
