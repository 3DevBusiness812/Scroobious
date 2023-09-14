import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourseProductObjectId1645935599697 implements MigrationInterface {
  name = 'CourseProductObjectId1645935599697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course_product" ADD "object_id" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course_product" DROP COLUMN "object_id"`);
  }
}
