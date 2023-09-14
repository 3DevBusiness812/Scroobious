import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'investor_type';
const listItems = [
  { id: 'ANGEL', description: 'Individual Angel' },
  { id: 'FAMILY', description: 'Family Office' },
  { id: 'CORP_VC', description: 'Corporate Venture Capital' },
  { id: 'VC', description: 'Venture Capital' },
  { id: 'PE', description: 'Private Equity' },
  { id: 'ACC', description: 'Accelerator' },
  { id: 'NONPROF', description: 'Foundation or Non-Profit' },
  { id: 'HEDGE', description: 'Hedge Fund' },
  { id: 'START_PGM', description: 'Start-Up Program' },
  { id: 'UNI_PGM', description: 'University Program' },
  { id: 'OTHER', description: 'Other' },
];

export class seedInvestorType11631936216741 implements MigrationInterface {
  name = 'seedInvestorType11631936216741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // console.log('seedInvestorType11631936216741');
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
