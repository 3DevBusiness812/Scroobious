import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourseOrganizationId1637899209260 implements MigrationInterface {
  name = 'CourseOrganizationId1637899209260';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course" ADD "organization_id" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "organization_id"`);
  }
}
