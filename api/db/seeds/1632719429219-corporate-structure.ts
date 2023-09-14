import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'corporate_structure';
const listItems = [
  { id: 'CC', description: 'C-Corp' },
  { id: 'LLC', description: 'LLC' },
  { id: 'BC', description: 'B-Corp' },
  { id: 'SC', description: 'S-Corp' },
  { id: 'NONE', description: 'Not yet incorporated' },
  { id: 'OTHER', description: 'Other' },
];

export class corporateStructure1632719429219 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
