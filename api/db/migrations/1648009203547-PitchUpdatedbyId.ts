import { MigrationInterface, QueryRunner } from 'typeorm';

export class PitchUpdatedbyId1648009203547 implements MigrationInterface {
  name = 'PitchUpdatedbyId1648009203547';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pitch" ADD CONSTRAINT "fk pitch updated_by_id" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch" DROP CONSTRAINT "fk pitch updated_by_id"`);
  }
}
