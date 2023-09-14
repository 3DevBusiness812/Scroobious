import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'funding_status';
const listItems = [
  { id: 'NOT_READY', description: 'Not ready to fundraise yet' },
  { id: 'NEARLY_READY', description: 'Nearly ready to fundraise' },
  { id: 'LT_250K', description: 'Raising less than $250K' },
  { id: '250K_499K', description: 'Raising $250K - $499K' },
  { id: '500K_999K', description: 'Raising $500K - $999K' },
  { id: '1M_3M', description: 'Raising $1M - $3M' },
  { id: 'GT_3M', description: 'Raising more than $3M' },
  { id: 'OTHER', description: 'Other' },
];

export class fundingStatus1632185142236 implements MigrationInterface {
  name = 'fundingStatus1632185142236';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
