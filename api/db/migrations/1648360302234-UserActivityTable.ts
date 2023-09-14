import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserActivityTable1648360302234 implements MigrationInterface {
  name = 'UserActivityTable1648360302234';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_activity" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "event_type" character varying NOT NULL, CONSTRAINT "pk user_activity id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "course_step" ADD CONSTRAINT "fk course_step created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_activity" ADD CONSTRAINT "fk user_activity created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(`DROP TABLE "tracking_event"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_activity" DROP CONSTRAINT "fk user_activity created_by_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "course_step" DROP CONSTRAINT "fk course_step created_by_id"`
    );
    await queryRunner.query(`DROP TABLE "user_activity"`);
  }
}
