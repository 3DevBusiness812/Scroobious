import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActiveDevelopment1641011230417 implements MigrationInterface {
  name = 'ActiveDevelopment1641011230417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_invite" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "email" character varying NOT NULL, "user_type" character varying NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "pk user_invite id" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_invite"`);
  }
}
