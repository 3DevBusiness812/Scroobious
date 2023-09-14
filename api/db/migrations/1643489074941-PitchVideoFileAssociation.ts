import {MigrationInterface, QueryRunner} from "typeorm";

export class PitchVideoFileAssociation1643489074941 implements MigrationInterface {
    name = 'PitchVideoFileAssociation1643489074941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" RENAME COLUMN "aws_url" TO "file_id"`);
        await queryRunner.query(`ALTER TABLE "video" ADD CONSTRAINT "uq video file_id" UNIQUE ("file_id")`);
        await queryRunner.query(`ALTER TABLE "video" ADD CONSTRAINT "fk video file_id" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" DROP CONSTRAINT "fk video file_id"`);
        await queryRunner.query(`ALTER TABLE "video" DROP CONSTRAINT "uq video file_id"`);
        await queryRunner.query(`ALTER TABLE "video" RENAME COLUMN "file_id" TO "aws_url"`);
    }

}
