import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'sexual_orientation';
const listItems = [
  { id: 'BI', description: 'Bisexual' },
  { id: 'GAY', description: 'Gay' },
  { id: 'HETERO', description: 'Heterosexual' },
  { id: 'QUEER', description: 'Queer' },
  { id: 'LES', description: 'Lesbian' },
  { id: 'ASEX', description: 'Asexual' },
  { id: 'PAN', description: 'Pansexual' },
  { id: 'NOC', description: 'Prefer not to say' },
  { id: 'OTHER', description: 'Other' },
];

export class sexualOrientation1632718092456 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
