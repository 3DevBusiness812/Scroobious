import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'state_province';
const listItems = [
  { id: 'AL', description: 'Alabama' },
  { id: 'AK', description: 'Alaska' },
  { id: 'AZ', description: 'Arizona' },
  { id: 'AR', description: 'Arkansas' },
  { id: 'CA', description: 'California' },
  { id: 'CO', description: 'Colorado' },
  { id: 'CT', description: 'Connecticut' },
  { id: 'DE', description: 'Delaware' },
  { id: 'DC', description: 'District of Columbia' },
  { id: 'FL', description: 'Florida' },
  { id: 'GA', description: 'Georgia' },
  { id: 'HI', description: 'Hawaii' },
  { id: 'ID', description: 'Idaho' },
  { id: 'IL', description: 'Illinois' },
  { id: 'IN', description: 'Indiana' },
  { id: 'IA', description: 'Iowa' },
  { id: 'KS', description: 'Kansas' },
  { id: 'KY', description: 'Kentucky' },
  { id: 'LA', description: 'Louisiana' },
  { id: 'ME', description: 'Maine' },
  { id: 'MD', description: 'Maryland' },
  { id: 'MA', description: 'Massachusetts' },
  { id: 'MI', description: 'Michigan' },
  { id: 'MN', description: 'Minnesota' },
  { id: 'MS', description: 'Mississippi' },
  { id: 'MO', description: 'Missouri' },
  { id: 'MT', description: 'Montana' },
  { id: 'NE', description: 'Nebraska' },
  { id: 'NV', description: 'Nevada' },
  { id: 'NH', description: 'New Hampshire' },
  { id: 'NJ', description: 'New Jersey' },
  { id: 'NM', description: 'New Mexico' },
  { id: 'NY', description: 'New York' },
  { id: 'NC', description: 'North Carolina' },
  { id: 'ND', description: 'North Dakota' },
  { id: 'OH', description: 'Ohio' },
  { id: 'OK', description: 'Oklahoma' },
  { id: 'OR', description: 'Oregon' },
  { id: 'PA', description: 'Pennsylvania' },
  { id: 'RI', description: 'Rhode Island' },
  { id: 'SC', description: 'South Carolina' },
  { id: 'SD', description: 'South Dakota' },
  { id: 'TN', description: 'Tennessee' },
  { id: 'TX', description: 'Texas' },
  { id: 'UT', description: 'Utah' },
  { id: 'VT', description: 'Vermont' },
  { id: 'VA', description: 'Virginia' },
  { id: 'WA', description: 'Washington' },
  { id: 'WV', description: 'West Virginia' },
  { id: 'WI', description: 'Wisconsin' },
  { id: 'WY', description: 'Wyoming' },
  { id: 'OTHER', description: 'Outside U.S.' },
];

export class stateProvince1632185345753 implements MigrationInterface {
  name = 'stateProvince1632185345753';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
