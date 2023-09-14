import { MigrationInterface, QueryRunner } from 'typeorm';

export class PerkToCategoryRelationship1641109760933 implements MigrationInterface {
  name = 'PerkToCategoryRelationship1641109760933';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "perk" RENAME COLUMN "category" TO "perk_category_id"`);
    await queryRunner.query(
      `ALTER TABLE "perk" ADD CONSTRAINT "fk perk perk_category_id" FOREIGN KEY ("perk_category_id") REFERENCES "perk_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "perk" DROP CONSTRAINT "fk perk perk_category_id"`);
    await queryRunner.query(`ALTER TABLE "perk" RENAME COLUMN "perk_category_id" TO "category"`);
  }
}
