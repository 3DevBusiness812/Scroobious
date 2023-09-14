import { MigrationInterface, QueryRunner } from 'typeorm';

export class FilePitchDeckAndFeedback1640582678541 implements MigrationInterface {
  name = 'FilePitchDeckAndFeedback1640582678541';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "pk file id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "pitch_deck" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "pitch_id" character varying NOT NULL, "file_id" character varying NOT NULL, CONSTRAINT "rc pitch_deck pitch_id" UNIQUE ("pitch_id"), CONSTRAINT "rc pitch_deck file_id" UNIQUE ("file_id"), CONSTRAINT "pk pitch_deck id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "pitch_meeting_feedback" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "pitch_id" character varying NOT NULL, "recording_file_id" character varying, "reviewer_notes" character varying, "course_id" character varying, CONSTRAINT "pk pitch_meeting_feedback id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "pitch_written_feedback" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "pitch_id" character varying NOT NULL, "pitch_deck_id" character varying NOT NULL, "reviewer_notes" character varying, "course_id" character varying, CONSTRAINT "pk pitch_written_feedback id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_deck" ADD CONSTRAINT "fk pitch_deck pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_deck" ADD CONSTRAINT "fk pitch_deck file_id" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch_deck" DROP CONSTRAINT "fk pitch_deck file_id"`);
    await queryRunner.query(`ALTER TABLE "pitch_deck" DROP CONSTRAINT "fk pitch_deck pitch_id"`);
    await queryRunner.query(`DROP TABLE "pitch_written_feedback"`);
    await queryRunner.query(`DROP TABLE "pitch_meeting_feedback"`);
    await queryRunner.query(`DROP TABLE "pitch_deck"`);
    await queryRunner.query(`DROP TABLE "file"`);
  }
}
