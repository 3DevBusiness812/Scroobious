import { MigrationInterface, QueryRunner } from 'typeorm';

export class FounderProfileCombineName1643256817881 implements MigrationInterface {
  name = 'FounderProfileCombineName1643256817881';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "first_name"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "last_name"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" ADD "name" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "last_name" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "first_name" character varying NOT NULL`
    );
  }
}
