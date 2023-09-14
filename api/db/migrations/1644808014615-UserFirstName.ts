import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserFirstName1644808014615 implements MigrationInterface {
  name = 'UserFirstName1644808014615';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "first_name" character varying`);
    await queryRunner.query(`UPDATE "user" SET first_name = split_part(name, ' ', 1)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "first_name"`);
  }
}
