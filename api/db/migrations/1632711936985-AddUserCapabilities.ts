import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserCapabilities1632711936985 implements MigrationInterface {
  name = 'AddUserCapabilities1632711936985';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user" ADD "capabilities" character varying array NOT NULL DEFAULT '{INVESTOR}';
      ALTER TABLE "user" ALTER COLUMN "capabilities" DROP DEFAULT      
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "capabilities"`);
  }
}
