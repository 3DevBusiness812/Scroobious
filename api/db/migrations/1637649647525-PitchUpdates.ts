import {MigrationInterface, QueryRunner} from "typeorm";

export class PitchUpdates1637649647525 implements MigrationInterface {
    name = 'PitchUpdates1637649647525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pitch" ALTER COLUMN "views" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pitch" ALTER COLUMN "bookmarks" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pitch" ALTER COLUMN "bookmarks" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pitch" ALTER COLUMN "views" SET NOT NULL`);
    }

}
