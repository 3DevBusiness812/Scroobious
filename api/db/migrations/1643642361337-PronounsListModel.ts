import { MigrationInterface, QueryRunner } from 'typeorm';

export class PronounsListModel1643642361337 implements MigrationInterface {
  name = 'PronounsListModel1643642361337';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pronoun" ("id" character varying NOT NULL, "description" character varying NOT NULL, "archived" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, CONSTRAINT "pk pronoun id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD "presentation_status" character varying`
    );
    await queryRunner.query(`ALTER TABLE "founder_profile" ADD "pronouns" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "pronouns"`);
    await queryRunner.query(`ALTER TABLE "founder_profile" DROP COLUMN "presentation_status"`);
    await queryRunner.query(`DROP TABLE "pronoun"`);
  }
}
