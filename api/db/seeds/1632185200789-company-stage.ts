import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'company_stage';
const listItems = [
  { id: 'IDEA', description: 'Idea (no product or revenue)' },
  { id: 'PRE-SEED', description: 'Pre-Seed (working product with early use)' },
  { id: 'SEED', description: 'Seed (working product with paying customers)' },
  {
    id: 'EARLY',
    description: 'Early Stage (between $1-5M revenue with repeatable customer acquisition process)',
  },
  { id: 'GROWTH', description: 'Growth stage ($5M+ revenue working on scaling)' },
  { id: 'OTHER', description: 'Other' },
];

export class companyStage1632185200789 implements MigrationInterface {
  name = 'companyStage1632185200789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
