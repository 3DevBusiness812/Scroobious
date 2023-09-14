import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAccreditedInvestor1644386688798 implements MigrationInterface {
  name = 'UserAccreditedInvestor1644386688798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "is_accredited" boolean DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_accredited"`);
  }
}
