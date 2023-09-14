import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'revenue';
const listItems = [
  { id: 'PRE', description: 'Pre-revenue' },
  { id: 'POST', description: 'Post-revenue' },
];

export class revenue1632189845746 implements MigrationInterface {
  name = 'revenue1632189845746';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
