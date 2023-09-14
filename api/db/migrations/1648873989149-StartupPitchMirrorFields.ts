import { MigrationInterface, QueryRunner } from 'typeorm';

export class StartupPitchMirrorFields1648873989149 implements MigrationInterface {
  name = 'StartupPitchMirrorFields1648873989149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "startup" ADD "deck_comfort_level" integer`);
    await queryRunner.query(`ALTER TABLE "startup" ADD "presentation_comfort_level" integer`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "elevator" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "elevator"`);
    await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "presentation_comfort_level"`);
    await queryRunner.query(`ALTER TABLE "startup" DROP COLUMN "deck_comfort_level"`);
  }
}
