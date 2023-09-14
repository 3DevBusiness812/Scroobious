import { MigrationInterface, QueryRunner } from 'typeorm';

export class VariousCleanup1632028607514 implements MigrationInterface {
  name = 'VariousCleanup1632028607514';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_type" DROP COLUMN "default_role"`);
    await queryRunner.query(
      `ALTER TABLE "investor_profile" ADD "user_id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "investor_profile" ADD CONSTRAINT "uq investor_profile user_id" UNIQUE ("user_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "user_type" ADD "default_role_id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user_type" ADD "allowed_at_registration" boolean NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "investor_profile" ADD CONSTRAINT "fk investor_profile user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_type" ADD CONSTRAINT "fk user_type default_role_id" FOREIGN KEY ("default_role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_type" DROP CONSTRAINT "fk user_type default_role_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "investor_profile" DROP CONSTRAINT "fk investor_profile user_id"`
    );
    await queryRunner.query(`ALTER TABLE "user_type" DROP COLUMN "allowed_at_registration"`);
    await queryRunner.query(`ALTER TABLE "user_type" DROP COLUMN "default_role_id"`);
    await queryRunner.query(
      `ALTER TABLE "investor_profile" DROP CONSTRAINT "uq investor_profile user_id"`
    );
    await queryRunner.query(`ALTER TABLE "investor_profile" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_type" ADD "default_role" character varying NOT NULL`
    );
  }
}
