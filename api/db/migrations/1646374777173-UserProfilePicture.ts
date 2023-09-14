import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserProfilePicture1646374777173 implements MigrationInterface {
  name = 'UserProfilePicture1646374777173';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "image" TO "profile_picture_file_id"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profile_picture_file_id"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "profile_picture_file_id" character varying`);

    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "uq user profile_picture_file_id" UNIQUE ("profile_picture_file_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "fk user profile_picture_file_id" FOREIGN KEY ("profile_picture_file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "fk user profile_picture_file_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "uq user profile_picture_file_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profile_picture_file_id"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "profile_picture_file_id" text NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "profile_picture_file_id" TO "image"`
    );
  }
}
