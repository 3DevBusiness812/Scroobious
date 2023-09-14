import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPitchDeckNumPagesAndIscategorizedFlag1680080742871 implements MigrationInterface {
    name = 'AddPitchDeckNumPagesAndIscategorizedFlag1680080742871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pitch_deck" ADD COLUMN IF NOT EXISTS "is_categorized" BOOLEAN NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" ADD COLUMN IF NOT EXISTS "num_pages" INTEGER NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "pitch_written_feedback" ALTER COLUMN "status" SET DEFAULT 'REQUESTED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pitch_deck" ALTER COLUMN "is_categorized" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pitch_deck" ALTER COLUMN "num_pages" DROP NOT NULL`);
    }

}
