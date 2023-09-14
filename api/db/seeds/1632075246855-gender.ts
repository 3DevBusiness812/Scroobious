import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'gender';
const listItems = [
  { id: 'WOMAN', description: 'Woman' },
  { id: 'NON_B', description: 'Non-binary/non-conforming' },
  { id: 'MAN', description: 'Man' },
  { id: 'NOC', description: 'Prefer not to say' },
  { id: 'OTHER', description: 'Other' },
];

export class gender1632075246855 implements MigrationInterface {
  name = 'gender1632075246855';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
