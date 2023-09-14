import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActiveDevelopment1660882476209 implements MigrationInterface {
  name = 'ActiveDevelopment1660882476209';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "investor_profile" ADD "ethnicities" character varying array`
    );
    await queryRunner.query(`ALTER TABLE "investor_profile" ADD "gender" character varying`);
    await queryRunner.query(`ALTER TABLE "investor_profile" ADD "pronouns" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investor_profile" DROP COLUMN "pronouns"`);
    await queryRunner.query(`ALTER TABLE "investor_profile" DROP COLUMN "gender"`);
    await queryRunner.query(`ALTER TABLE "investor_profile" DROP COLUMN "ethnicities"`);
  }
}
