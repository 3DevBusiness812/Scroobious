import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanUpFounderTables1633325722300 implements MigrationInterface {
  name = 'CleanUpFounderTables1633325722300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "investor_profile" RENAME COLUMN "linked_in_url" TO "linkedin_url"`
    );
    await queryRunner.query(
      `CREATE TABLE "startup" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "name" character varying, "website" character varying, "corporate_structure" character varying, "country" character varying, "state_province" character varying, "fundraise_status" character varying, "company_stage" character varying, "revenue" character varying, "industry" character varying, "short_description" character varying, "organization_id" character varying NOT NULL, CONSTRAINT "rc startup organization_id" UNIQUE ("organization_id"), CONSTRAINT "pk startup id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "tracking_event" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "event_type" character varying NOT NULL, "resource_type" character varying NOT NULL, "resource_id" character varying NOT NULL, CONSTRAINT "pk tracking_event id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "industry"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "revenue"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "funding_status"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "company_stage"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "elevator"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "revenue"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "company_stage"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "image"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "location"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "industry"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "videos"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "slides"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "funding_status"`);
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "first_name" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "last_name" character varying NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "founder_profile" ADD "twitter_url" character varying`);
    await queryRunner.query(`ALTER TABLE "founder_profile" ADD "linkedin_url" character varying`);
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "ethnicities" character varying array`
    );
    await queryRunner.query(`ALTER TABLE "founder_profile" ADD "gender" character varying`);
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "sexual_orientation" character varying`
    );
    await queryRunner.query(`ALTER TABLE "founder_profile" ADD "transgender" character varying`);
    await queryRunner.query(`ALTER TABLE "founder_profile" ADD "disability" character varying`);
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "company_roles" character varying array`
    );
    await queryRunner.query(`ALTER TABLE "founder_profile" ADD "additional_team_members" boolean`);
    await queryRunner.query(`ALTER TABLE "founder_profile" ADD "working_status" character varying`);
    await queryRunner.query(`ALTER TABLE "founder_profile" ADD "origin_story" character varying`);
    await queryRunner.query(`ALTER TABLE "founder_profile" ADD "source" character varying`);
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "business_challenge" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "desired_support" character varying`
    );
    await queryRunner.query(`ALTER TABLE "founder_profile" ADD "anything_else" character varying`);
    await queryRunner.query(`ALTER TABLE "organization" ADD "startup_id" character varying`);
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "uq organization startup_id" UNIQUE ("startup_id")`
    );
    await queryRunner.query(`ALTER TABLE "pitch" ADD "deck_url" character varying`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "video_url" character varying`);
    await queryRunner.query(
      `ALTER TABLE "pitch" ADD "presentation_statuses" character varying array`
    );
    await queryRunner.query(`ALTER TABLE "pitch" ADD "deck_comfort_level" character varying`);
    await queryRunner.query(
      `ALTER TABLE "pitch" ADD "presentation_comfort_level" character varying`
    );
    await queryRunner.query(`ALTER TABLE "pitch" ADD "challenges" character varying`);
    await queryRunner.query(`ALTER TABLE "user" ADD "investor_profile_id" character varying`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "uq user investor_profile_id" UNIQUE ("investor_profile_id")`
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "founder_profile_id" character varying`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "uq user founder_profile_id" UNIQUE ("founder_profile_id")`
    );
    await queryRunner.query(`ALTER TABLE "pitch" ALTER COLUMN "elevator" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "startup" ADD CONSTRAINT "fk startup organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "fk organization startup_id" FOREIGN KEY ("startup_id") REFERENCES "startup"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "fk user investor_profile_id" FOREIGN KEY ("investor_profile_id") REFERENCES "investor_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "fk user founder_profile_id" FOREIGN KEY ("founder_profile_id") REFERENCES "founder_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "fk user founder_profile_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "fk user investor_profile_id"`);
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "fk organization startup_id"`
    );
    await queryRunner.query(`ALTER TABLE "startup" DROP CONSTRAINT "fk startup organization_id"`);
    await queryRunner.query(`ALTER TABLE "pitch" ALTER COLUMN "elevator" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "uq user founder_profile_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "founder_profile_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "uq user investor_profile_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "investor_profile_id"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "challenges"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "presentation_comfort_level"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "deck_comfort_level"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "presentation_statuses"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "video_url"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "deck_url"`);
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "uq organization startup_id"`
    );
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "startup_id"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "anything_else"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "desired_support"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "business_challenge"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "source"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "origin_story"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "working_status"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "additional_team_members"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "company_roles"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "disability"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "transgender"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "sexual_orientation"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "gender"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "ethnicities"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "linkedin_url"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "twitter_url"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "last_name"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "first_name"`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "funding_status" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "slides" character varying array`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "videos" character varying array`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "industry" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "location" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "image" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "company_stage" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "revenue" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "name" character varying NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "elevator" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "company_stage" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "funding_status" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "revenue" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "industry" character varying NOT NULL`
    );
    await queryRunner.query(`DROP TABLE "tracking_event"`);
    await queryRunner.query(`DROP TABLE "startup"`);
    await queryRunner.query(
      `ALTER TABLE "investor_profile" RENAME COLUMN "linkedin_url" TO "linked_in_url"`
    );
  }
}
