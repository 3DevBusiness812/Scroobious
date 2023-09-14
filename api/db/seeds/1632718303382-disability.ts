import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'disability';
const listItems = [
  { id: 'VISIBLE', description: 'I have a visible disability' },
  { id: 'INVISIBLE', description: 'I have an invisible disability' },
  { id: 'BOTH-DIS', description: 'I have both a visible and invisible disability' },
  { id: 'NONE-DIS', description: 'I do not have a disability' },
  { id: 'NOC', description: 'Prefer not to say' },
];

export class disability1632718303382 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
