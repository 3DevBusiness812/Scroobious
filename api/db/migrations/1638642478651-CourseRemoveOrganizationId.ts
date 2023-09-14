import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActiveDevelopment1638642478651 implements MigrationInterface {
  name = 'ActiveDevelopment1638642478651';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "fk course organization_id"`);
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "organization_id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course" ADD "organization_id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "course" ADD CONSTRAINT "fk course organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
