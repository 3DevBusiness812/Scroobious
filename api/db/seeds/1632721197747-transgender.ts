import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'transgender';

const listItems = [
  { id: 'NO', description: 'No' },
  { id: 'YES', description: 'Yes' },
  { id: 'NOC', description: 'Prefer not to say' },
];

export class transgender1632721197747 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
