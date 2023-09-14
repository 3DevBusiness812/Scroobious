import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'suggested_resource_category';
const listItems = [{ id: 'WORKSHOP', description: 'Workshop Replay' }];

export class addSuggestedResourceWorkshop1645113745947 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
