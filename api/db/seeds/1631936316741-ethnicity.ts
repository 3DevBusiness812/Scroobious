import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'ethnicity';
const listItems = [
  { id: 'BLACK', description: 'African-American/Black' },
  { id: 'E_A', description: 'East Asian' },
  { id: 'SE_A', description: 'Southeast Asian' },
  { id: 'S_A', description: 'South Asian' },
  { id: 'PACIFIC', description: 'Pacific Islander' },
  { id: 'HISP', description: 'Hispanic/Latinx' },
  { id: 'MIDEAST', description: 'Middle Eastern/North African' },
  { id: 'NATIVE', description: 'Native American/Alaskan Native' },
  { id: 'WHITE', description: 'White' },
  { id: 'OTHER', description: 'Other' },
  { id: 'NOC', description: 'Prefer not to say' },
];

export class ethnicityType1631936316741 implements MigrationInterface {
  name = 'ethnicityType1631936316741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
