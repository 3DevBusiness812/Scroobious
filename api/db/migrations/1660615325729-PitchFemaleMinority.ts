import { MigrationInterface, QueryRunner } from 'typeorm';

export class PitchFemaleMinority1660615325729 implements MigrationInterface {
  name = 'PitchFemaleMinority1660615325729';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch" ADD "female" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "minority" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "minority"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "female"`);
  }
}
