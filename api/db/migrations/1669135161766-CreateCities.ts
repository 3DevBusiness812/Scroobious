import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCities1669135161766 implements MigrationInterface {
    name = 'CreateCities1669135161766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "city" ("id" character varying NOT NULL, "lat" double precision, "lon" double precision, "population" integer, "state_province_id" character varying NOT NULL, "description" character varying NOT NULL, "archived" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_by_id" character varying, CONSTRAINT "pk city id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "city" ADD CONSTRAINT "fk city state_province_id" FOREIGN KEY ("state_province_id") REFERENCES "state_province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "city" DROP CONSTRAINT "fk city state_province_id"`);
        await queryRunner.query(`DROP TABLE "city"`);
    }

}
