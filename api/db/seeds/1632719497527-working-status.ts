import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'working_status';
const listItems = [
  { id: 'FT', description: 'Full-time' },
  { id: 'PT', description: 'Part-time' },
  { id: 'ELSE', description: 'Something else' },
  { id: 'COMP', description: "It's complicated" },
  { id: 'OTHER', description: 'Other' },
];

export class workingStatus1632719497527 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
