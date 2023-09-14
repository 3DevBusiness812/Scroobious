import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTypes1631601036372 implements MigrationInterface {
  name = 'UserTypes1631601036372';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_type" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "type" character varying NOT NULL, "default_role" character varying NOT NULL, CONSTRAINT "pk user_type id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_type_user" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "user_id" character varying NOT NULL, "user_type_id" character varying NOT NULL, CONSTRAINT "uq user_type_user user_id+user_type_id" UNIQUE ("user_id", "user_type_id"), CONSTRAINT "pk user_type_user id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "investor_profile" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "accreditation_status" character varying array NOT NULL, "linked_in_url" character varying NOT NULL, "investor_types" character varying array NOT NULL, "thesis" text, "criteria" character varying array, "industries" character varying array, "demographics" character varying array, "location" character varying, CONSTRAINT "pk investor_profile id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "status" character varying NOT NULL DEFAULT 'ONBOARDING'`
    );
    await queryRunner.query(
      `ALTER TABLE "user_type_user" ADD CONSTRAINT "fk user_type_user user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_type_user" ADD CONSTRAINT "fk user_type_user user_type_id" FOREIGN KEY ("user_type_id") REFERENCES "user_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_type_user" DROP CONSTRAINT "fk user_type_user user_type_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_type_user" DROP CONSTRAINT "fk user_type_user user_id"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TABLE "investor_profile"`);
    await queryRunner.query(`DROP TABLE "user_type_user"`);
    await queryRunner.query(`DROP TABLE "user_type"`);
  }
}
