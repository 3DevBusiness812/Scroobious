import {MigrationInterface, QueryRunner} from "typeorm";

export class FileClassUpdates1641704813212 implements MigrationInterface {
    name = 'FileClassUpdates1641704813212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "perk" RENAME COLUMN "logo_file" TO "logo_file_id"`);
        await queryRunner.query(`ALTER TABLE "perk" ADD CONSTRAINT "uq perk logo_file_id" UNIQUE ("logo_file_id")`);
        await queryRunner.query(`ALTER TABLE "perk" ADD CONSTRAINT "fk perk logo_file_id" FOREIGN KEY ("logo_file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "perk" DROP CONSTRAINT "fk perk logo_file_id"`);
        await queryRunner.query(`ALTER TABLE "perk" DROP CONSTRAINT "uq perk logo_file_id"`);
        await queryRunner.query(`ALTER TABLE "perk" RENAME COLUMN "logo_file_id" TO "logo_file"`);
    }

}
