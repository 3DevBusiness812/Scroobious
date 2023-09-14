import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamePitchFeedbackToComment1639807049843 implements MigrationInterface {
  name = 'RenamePitchFeedbackToComment1639807049843';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pitch_comment" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "body" character varying NOT NULL, "pitch_id" character varying NOT NULL, "visibility" character varying NOT NULL, CONSTRAINT "pk pitch_comment id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_comment" ADD CONSTRAINT "fk pitch_comment pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_comment" ADD CONSTRAINT "fk pitch_comment created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pitch_comment" DROP CONSTRAINT "fk pitch_comment created_by_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_comment" DROP CONSTRAINT "fk pitch_comment pitch_id"`
    );
    await queryRunner.query(`DROP TABLE "pitch_comment"`);
  }
}
