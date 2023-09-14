import { MigrationInterface, QueryRunner } from 'typeorm';

export class PitchUpdates21640841266032 implements MigrationInterface {
  name = 'PitchUpdates21640841266032';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch" DROP CONSTRAINT "fk pitch pitch_deck_id"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP CONSTRAINT "uq pitch pitch_deck_id"`);
    await queryRunner.query(`ALTER TABLE "pitch" DROP COLUMN "pitch_deck_id"`);
    await queryRunner.query(`ALTER TABLE "pitch_deck" ADD "status" character varying NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "pitch" ADD CONSTRAINT "fk pitch created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pitch" DROP CONSTRAINT "fk pitch created_by_id"`);
    await queryRunner.query(`ALTER TABLE "pitch_deck" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "pitch" ADD "pitch_deck_id" character varying`);
    await queryRunner.query(
      `ALTER TABLE "pitch" ADD CONSTRAINT "uq pitch pitch_deck_id" UNIQUE ("pitch_deck_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "pitch" ADD CONSTRAINT "fk pitch pitch_deck_id" FOREIGN KEY ("pitch_deck_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
