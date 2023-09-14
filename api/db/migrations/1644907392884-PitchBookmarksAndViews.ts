import { MigrationInterface, QueryRunner } from 'typeorm';

export class PitchBookmarksAndViews1644907392884 implements MigrationInterface {
  name = 'PitchBookmarksAndViews1644907392884';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "pitch" SET "views" = 0 WHERE "views" IS NULL`);
    await queryRunner.query(`ALTER TABLE "pitch" ALTER COLUMN "views" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "pitch" ALTER COLUMN "views" SET NOT NULL`);
    await queryRunner.query(`UPDATE "pitch" SET "bookmarks" = 0 WHERE "bookmarks" IS NULL`);
    await queryRunner.query(`ALTER TABLE "pitch" ALTER COLUMN "bookmarks" SET DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "pitch" ALTER COLUMN "bookmarks" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch" ALTER COLUMN "bookmarks" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "pitch" ALTER COLUMN "bookmarks" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "pitch" ALTER COLUMN "views" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "pitch" ALTER COLUMN "views" DROP DEFAULT`);
  }
}
