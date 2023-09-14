import {MigrationInterface, QueryRunner} from "typeorm";

export class ActiveDevelopment1677110388690 implements MigrationInterface {
    name = 'ActiveDevelopment1677110388690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pitch_video" ALTER COLUMN "extended_video" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pitch_video" ALTER COLUMN "extended_video" DROP NOT NULL`);
    }

}
