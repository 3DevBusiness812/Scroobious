import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'presentation_status';
const listItems = [
  { id: 'BOTH-PRES', description: 'Yes, both in person and remotely' },
  { id: 'YP', description: 'Yes, in person' },
  { id: 'YR', description: 'Yes, remotely' },
  { id: 'NO', description: 'No' },
];

export class presentationStatus1632719374796 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
