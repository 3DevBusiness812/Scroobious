import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'company_role';
const listItems = [
  { id: 'SOLO', description: 'Single Founder' },
  { id: 'COF', description: 'Co-Founder' },
  { id: 'CEO', description: 'CEO' },
  { id: 'OTHER', description: 'Other' },
];

export class companyRole1632719322314 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
