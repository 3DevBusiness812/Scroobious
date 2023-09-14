import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixOneToOneFkRelationships1635621244621 implements MigrationInterface {
  name = 'FixOneToOneFkRelationships1635621244621';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "founder_profile" DROP CONSTRAINT "fk founder_profile user_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "fk organization startup_id"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "fk user founder_profile_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "fk user investor_profile_id"`);
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "uq organization startup_id"`
    );
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "startup_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "uq user investor_profile_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "investor_profile_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "uq user founder_profile_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "founder_profile_id"`);
    await queryRunner.query(
      `ALTER TABLE "founder_profile" DROP CONSTRAINT "rc founder_profile user_id"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD CONSTRAINT "rc founder_profile user_id" UNIQUE ("user_id")`
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "founder_profile_id" character varying`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "uq user founder_profile_id" UNIQUE ("founder_profile_id")`
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "investor_profile_id" character varying`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "uq user investor_profile_id" UNIQUE ("investor_profile_id")`
    );
    await queryRunner.query(`ALTER TABLE "organization" ADD "startup_id" character varying`);
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "uq organization startup_id" UNIQUE ("startup_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "fk user investor_profile_id" FOREIGN KEY ("investor_profile_id") REFERENCES "investor_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "fk user founder_profile_id" FOREIGN KEY ("founder_profile_id") REFERENCES "founder_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "fk organization startup_id" FOREIGN KEY ("startup_id") REFERENCES "startup"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "founder_profile" ADD CONSTRAINT "fk founder_profile user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
