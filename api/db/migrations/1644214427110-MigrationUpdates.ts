import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationUpdates1644214427110 implements MigrationInterface {
  name = 'MigrationUpdates1644214427110';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "additional_team_members"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "origin_story"`);
    await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "industry"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "elevator"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "migrated_from_bubble" boolean DEFAULT false`);
    await queryRunner.query(
      `ALTER TABLE "startup" ADD "industries" character varying array NOT NULL DEFAULT '{}'`
    );
    await queryRunner.query(`ALTER TABLE "startup" ADD "origin_story" character varying`);
    await queryRunner.query(`ALTER TABLE "startup" ADD "elevator" character varying`);
    await queryRunner.query(`ALTER TABLE "startup" ADD "additional_team_members" boolean`);
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD CONSTRAINT "uq founder_profile user_id" UNIQUE ("user_id")`
    );
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "deck_comfort_level"`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "deck_comfort_level" integer`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "presentation_comfort_level"`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "presentation_comfort_level" integer`);
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "bubble_location" character varying`
    );

    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "presentation_statuses"`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "presentation_status" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "presentation_status"`);
    await queryRunner.query(
      `ALTER TABLE "pitch" ADD "presentation_status" character varying array`
    );
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "bubble_location"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "presentation_comfort_level"`);
    await queryRunner.query(
      `ALTER TABLE "pitch" ADD "presentation_comfort_level" character varying`
    );
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "deck_comfort_level"`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "deck_comfort_level" character varying`);
    await queryRunner.query(
      `ALTER TABLE "founder_profile" DROP CONSTRAINT "uq founder_profile user_id"`
    );
    await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "additional_team_members"`);
    await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "elevator"`);
    await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "origin_story"`);
    await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "industries"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "migrated_from_bubble"`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "elevator" character varying`);
    await queryRunner.query(`ALTER TABLE "startup" ADD "industry" character varying`);
    await queryRunner.query(`ALTER TABLE "founder_profile" ADD "origin_story" character varying`);
    await queryRunner.query(`ALTER TABLE "founder_profile" ADD "additional_team_members" boolean`);
  }
}
