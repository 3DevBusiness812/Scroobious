import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActiveDevelopment1631510568406 implements MigrationInterface {
  name = 'ActiveDevelopment1631510568406';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_role" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "user_id" character varying NOT NULL, "role_id" character varying NOT NULL, "organization" character varying, CONSTRAINT "uq user_role role_id+user_id" UNIQUE ("user_id", "role_id"), CONSTRAINT "pk user_role id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "name" character varying NOT NULL, "code" character varying(50) NOT NULL, CONSTRAINT "uq role code" UNIQUE ("code"), CONSTRAINT "pk role id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "role_permission" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "permission_id" character varying NOT NULL, "role_id" character varying NOT NULL, CONSTRAINT "uq role_permission permission_id+role_id" UNIQUE ("role_id", "permission_id"), CONSTRAINT "pk role_permission id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "code" character varying(50) NOT NULL, "description" character varying(100), CONSTRAINT "uq permission code" UNIQUE ("code"), CONSTRAINT "pk permission id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "event_type" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "name" character varying NOT NULL, "template" character varying, "allow_subscription" boolean NOT NULL DEFAULT true, CONSTRAINT "uq event_type name" UNIQUE ("name"), CONSTRAINT "pk event_type id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "event" ("id" character varying NOT NULL, "type" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'NEW', "object_type" character varying NOT NULL, "object_id" character varying NOT NULL, "owner_id" character varying NOT NULL, "payload" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, CONSTRAINT "pk event id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "conversation" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "friendly_name" character varying, CONSTRAINT "pk conversation id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "conversation_participant" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "conversation_id" character varying NOT NULL, "user_id" character varying NOT NULL, "last_read_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "pk conversation_participant id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "pitch_update" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "body" character varying NOT NULL, "pitch_id" character varying NOT NULL, CONSTRAINT "pk pitch_update id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "pitch_user_status" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "user_id" character varying NOT NULL, "pitch_id" character varying NOT NULL, "watch_status" character varying NOT NULL DEFAULT 'UNWATCHED', "list_status" character varying NOT NULL DEFAULT 'DEFAULT', CONSTRAINT "uq pitch_user_status pitch_id+user_id" UNIQUE ("user_id", "pitch_id"), CONSTRAINT "pk pitch_user_status id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "pitch" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "name" character varying NOT NULL, "user_id" character varying NOT NULL, "organization_id" character varying NOT NULL, "image" character varying NOT NULL, "industry" character varying NOT NULL, "location" character varying NOT NULL, "funding_status" character varying NOT NULL, "company_stage" character varying NOT NULL, "revenue" character varying NOT NULL, "elevator" character varying NOT NULL, "views" integer NOT NULL, "bookmarks" integer NOT NULL, "videos" character varying array, "slides" character varying array, CONSTRAINT "pk pitch id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "email_verified" TIMESTAMP WITH TIME ZONE, "image" text NOT NULL, "password" character varying, CONSTRAINT "uq user email" UNIQUE ("email"), CONSTRAINT "pk user id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "organization" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "user_id" character varying NOT NULL, "name" character varying NOT NULL, "website" character varying NOT NULL, CONSTRAINT "pk organization id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "idx organization user_id" ON "organization" ("user_id") `
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "user_id" character varying NOT NULL, "expires" TIMESTAMP WITH TIME ZONE NOT NULL, "session_token" character varying NOT NULL, "access_token" character varying NOT NULL, CONSTRAINT "uq session session_token" UNIQUE ("session_token"), CONSTRAINT "uq session access_token" UNIQUE ("access_token"), CONSTRAINT "pk session id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "verification_request" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "identifier" character varying NOT NULL, "token" character varying NOT NULL, "expires" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "uq verification_request token" UNIQUE ("token"), CONSTRAINT "pk verification_request id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "conversation_message" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "conversation_id" character varying NOT NULL, "body" character varying(1600) NOT NULL, "read_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "pk conversation_message id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "industry" ("id" character varying NOT NULL, "code" character varying NOT NULL, "description" character varying NOT NULL, "archived" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, CONSTRAINT "pk industry id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "auth_account" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "user_id" character varying NOT NULL, "provider_type" character varying NOT NULL, "provider_id" character varying NOT NULL, "provider_account_id" character varying NOT NULL, "refresh_token" text, "access_token" text, "access_token_expires" TIMESTAMP WITH TIME ZONE, "compound_id" character varying NOT NULL, CONSTRAINT "uq auth_account compound_id" UNIQUE ("compound_id"), CONSTRAINT "pk auth_account id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "idx auth_account user_id" ON "auth_account" ("user_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "idx auth_account provider_id" ON "auth_account" ("provider_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "idx auth_account provider_account_id" ON "auth_account" ("provider_account_id") `
    );
    await queryRunner.query(
      `CREATE TABLE "subscription" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "event_type_id" character varying NOT NULL, "type" character varying NOT NULL, "url" character varying, "job_id" character varying, "active" boolean DEFAULT true, CONSTRAINT "pk subscription id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD CONSTRAINT "fk user_role role_id" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "fk role_permission permission_id" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "fk role_permission role_id" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participant" ADD CONSTRAINT "fk conversation_participant conversation_id" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participant" ADD CONSTRAINT "fk conversation_participant user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_update" ADD CONSTRAINT "fk pitch_update pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_update" ADD CONSTRAINT "fk pitch_update created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_user_status" ADD CONSTRAINT "fk pitch_user_status user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_user_status" ADD CONSTRAINT "fk pitch_user_status pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch" ADD CONSTRAINT "fk pitch user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch" ADD CONSTRAINT "fk pitch organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "fk organization user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_message" ADD CONSTRAINT "fk conversation_message conversation_id" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_message" ADD CONSTRAINT "fk conversation_message created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "auth_account" ADD CONSTRAINT "fk auth_account user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "auth_account" DROP CONSTRAINT "fk auth_account user_id"`);
    await queryRunner.query(
      `ALTER TABLE "conversation_message" DROP CONSTRAINT "fk conversation_message created_by_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_message" DROP CONSTRAINT "fk conversation_message conversation_id"`
    );
    await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "fk organization user_id"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP CONSTRAINT "fk pitch organization_id"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP CONSTRAINT "fk pitch user_id"`);
    await queryRunner.query(
      `ALTER TABLE "pitch_user_status" DROP CONSTRAINT "fk pitch_user_status pitch_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_user_status" DROP CONSTRAINT "fk pitch_user_status user_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_update" DROP CONSTRAINT "fk pitch_update created_by_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch_update" DROP CONSTRAINT "fk pitch_update pitch_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participant" DROP CONSTRAINT "fk conversation_participant user_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_participant" DROP CONSTRAINT "fk conversation_participant conversation_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "fk role_permission role_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "fk role_permission permission_id"`
    );
    await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "fk user_role role_id"`);
    await queryRunner.query(`DROP TABLE "subscription"`);
    await queryRunner.query(`DROP INDEX "idx auth_account provider_account_id"`);
    await queryRunner.query(`DROP INDEX "idx auth_account provider_id"`);
    await queryRunner.query(`DROP INDEX "idx auth_account user_id"`);
    await queryRunner.query(`DROP TABLE "auth_account"`);
    await queryRunner.query(`DROP TABLE "industry"`);
    await queryRunner.query(`DROP TABLE "conversation_message"`);
    await queryRunner.query(`DROP TABLE "verification_request"`);
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP INDEX "idx organization user_id"`);
    await queryRunner.query(`DROP TABLE "organization"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "pitch"`);
    await queryRunner.query(`DROP TABLE "pitch_user_status"`);
    await queryRunner.query(`DROP TABLE "pitch_update"`);
    await queryRunner.query(`DROP TABLE "conversation_participant"`);
    await queryRunner.query(`DROP TABLE "conversation"`);
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`DROP TABLE "event_type"`);
    await queryRunner.query(`DROP TABLE "permission"`);
    await queryRunner.query(`DROP TABLE "role_permission"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "user_role"`);
  }
}
