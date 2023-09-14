import {MigrationInterface, QueryRunner} from "typeorm";

export class ActiveDevelopment1642476769990 implements MigrationInterface {
    name = 'ActiveDevelopment1642476769990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "external_system_id" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "external_system_id" character varying NOT NULL, "external_system_name" character varying NOT NULL, "user_id" character varying, CONSTRAINT "pk external_system_id id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_plan_registration" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "email" character varying NOT NULL, "full_name" character varying NOT NULL, "stripe_subscription_id" character varying NOT NULL, "stripe_plan_id" character varying NOT NULL, "raw" jsonb NOT NULL, "status" character varying NOT NULL DEFAULT 'INPROGRESS', "user_id" character varying NOT NULL, CONSTRAINT "pk user_plan_registration id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plan" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "stripe_plan_id" character varying NOT NULL, "stripe_plan_name" character varying NOT NULL, "stripe_plan_description" character varying NOT NULL, "stripe_plan_currency" character varying NOT NULL, "stripe_plan_price" double precision NOT NULL, "stripe_plan_period" character varying NOT NULL, "user_id" character varying NOT NULL, CONSTRAINT "pk plan id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "checkout_request" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "stripe_plan_id" character varying NOT NULL, CONSTRAINT "pk checkout_request id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "checkout_response" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, "deleted_at" character varying, "deleted_by_id" character varying, "version" integer NOT NULL, "owner_id" character varying NOT NULL, "stripe_session_id" character varying NOT NULL, CONSTRAINT "pk checkout_response id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "external_system_id" ADD CONSTRAINT "fk external_system_id user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_plan_registration" ADD CONSTRAINT "fk user_plan_registration user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan" ADD CONSTRAINT "fk plan user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" DROP CONSTRAINT "fk plan user_id"`);
        await queryRunner.query(`ALTER TABLE "user_plan_registration" DROP CONSTRAINT "fk user_plan_registration user_id"`);
        await queryRunner.query(`ALTER TABLE "external_system_id" DROP CONSTRAINT "fk external_system_id user_id"`);
        await queryRunner.query(`DROP TABLE "checkout_response"`);
        await queryRunner.query(`DROP TABLE "checkout_request"`);
        await queryRunner.query(`DROP TABLE "plan"`);
        await queryRunner.query(`DROP TABLE "user_plan_registration"`);
        await queryRunner.query(`DROP TABLE "external_system_id"`);
    }

}
