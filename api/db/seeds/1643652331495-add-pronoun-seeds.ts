import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'pronoun';
const listItems = [
  { id: 'SHE', description: 'She/her/hers' },
  { id: 'HE', description: 'He/him/his' },
  { id: 'THEY', description: 'They/them/theirs' },
  { id: 'OTHER', description: 'Other' },
];

export class addPronounSeeds1643652331495 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
