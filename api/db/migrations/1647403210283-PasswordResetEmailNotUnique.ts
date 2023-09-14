import {MigrationInterface, QueryRunner} from "typeorm";

export class PasswordResetEmailNotUnique1647403210283 implements MigrationInterface {
    name = 'PasswordResetEmailNotUnique1647403210283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset" DROP CONSTRAINT "uq password_reset email"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset" ADD CONSTRAINT "uq password_reset email" UNIQUE ("email")`);
    }

}
