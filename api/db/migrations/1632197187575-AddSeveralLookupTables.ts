import {MigrationInterface, QueryRunner} from "typeorm";

export class ActiveDevelopment1632197187575 implements MigrationInterface {
    name = 'ActiveDevelopment1632197187575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "founder_profile" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "user_id" character varying NOT NULL, "industry" character varying NOT NULL, "location" character varying NOT NULL, "funding_status" character varying NOT NULL, "company_stage" character varying NOT NULL, "revenue" character varying NOT NULL, "elevator" character varying NOT NULL, CONSTRAINT "rc founder_profile user_id" UNIQUE ("user_id"), CONSTRAINT "pk founder_profile id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "state_province" ("id" character varying NOT NULL, "description" character varying NOT NULL, "archived" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, CONSTRAINT "pk state_province id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_stage" ("id" character varying NOT NULL, "description" character varying NOT NULL, "archived" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, CONSTRAINT "pk company_stage id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "funding_status" ("id" character varying NOT NULL, "description" character varying NOT NULL, "archived" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, CONSTRAINT "pk funding_status id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "revenue" ("id" character varying NOT NULL, "description" character varying NOT NULL, "archived" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, CONSTRAINT "pk revenue id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "industry" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "founder_profile" ADD CONSTRAINT "fk founder_profile user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "founder_profile" DROP CONSTRAINT "fk founder_profile user_id"`);
        await queryRunner.query(`ALTER TABLE "industry" ADD "code" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "revenue"`);
        await queryRunner.query(`DROP TABLE "funding_status"`);
        await queryRunner.query(`DROP TABLE "company_stage"`);
        await queryRunner.query(`DROP TABLE "state_province"`);
        await queryRunner.query(`DROP TABLE "founder_profile"`);
    }

}
