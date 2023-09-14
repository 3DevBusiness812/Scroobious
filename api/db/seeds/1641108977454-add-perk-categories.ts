import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'perk_category';
const listItems = [
  { id: 'ACCOUNTING', description: 'Accounting & Finance' },
  { id: 'APIS', description: 'APIs & DevOps' },
  { id: 'CAP_TABLE', description: 'Cap Table & Fundraising' },
  { id: 'COLLAB', description: 'Collaboration' },
  { id: 'COMMS', description: 'Communications' },
  { id: 'CRM_SALES', description: 'CRM & Sales' },
  { id: 'CSTR_SERVICE', description: 'Customer Service & CX' },
  { id: 'FINANCE', description: 'Financial Services' },
  { id: 'HR', description: 'HR' },
  { id: 'MARKETING', description: 'Marketing' },
  { id: 'SOFTWARE', description: 'Software Development' },
  { id: 'BOOKKEEP', description: 'Bookkeeping' },
  { id: 'DEV_PLATFORM', description: 'Developer Platforms' },
  { id: 'EQUITY', description: 'Equity Management' },
  { id: 'SCENARIO', description: 'Scenario Modeling' },
  { id: 'PROJ_MGMT', description: 'Project Management' },
  { id: 'CHAT', description: 'Chat' },
  { id: 'CONFERENCE', description: 'Conferencing' },
  { id: 'CRM', description: 'CRM' },
  { id: 'INCORP', description: 'Incorporation' },
  { id: 'EMAIL', description: 'Email Marketing' },
  { id: 'LOW_CODE', description: 'Low Code/No Code' },
];

export class addPerkCategories1641108977454 implements MigrationInterface {
  name = 'addPerkCategories1641108977454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
