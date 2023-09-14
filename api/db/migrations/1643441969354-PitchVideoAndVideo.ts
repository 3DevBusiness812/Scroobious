import {MigrationInterface, QueryRunner} from "typeorm";

export class PitchVideoAndVideo1643441969354 implements MigrationInterface {
    name = 'PitchVideoAndVideo1643441969354'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "video" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "aws_url" character varying NOT NULL, "wistia_id" character varying NOT NULL, CONSTRAINT "pk video id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pitch_video" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "status" character varying NOT NULL, "pitch_id" character varying NOT NULL, "video_id" character varying NOT NULL, CONSTRAINT "rc pitch_video video_id" UNIQUE ("video_id"), CONSTRAINT "pk pitch_video id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pitch_video" ADD CONSTRAINT "fk pitch_video pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pitch_video" ADD CONSTRAINT "fk pitch_video video_id" FOREIGN KEY ("video_id") REFERENCES "video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pitch_video" DROP CONSTRAINT "fk pitch_video video_id"`);
        await queryRunner.query(`ALTER TABLE "pitch_video" DROP CONSTRAINT "fk pitch_video pitch_id"`);
        await queryRunner.query(`DROP TABLE "pitch_video"`);
        await queryRunner.query(`DROP TABLE "video"`);
    }

}
