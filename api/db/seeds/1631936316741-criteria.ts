import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'criteria';
const listItems = [
  { id: 'PERS', description: 'Personal or warm connection' },
  { id: 'GEND', description: 'Gender of leadership' },
  { id: 'MINORITY', description: 'Minority leadership' },
  { id: 'INDUS', description: 'Industry' },
  { id: 'STAGE', description: 'Company stage' },
  { id: 'SIZECOMP', description: 'Company size' },
  { id: 'EXP', description: 'CEO experience' },
  { id: 'CAUSE', description: 'Cause or mission I’m passionate about' },
  { id: 'RETURN', description: 'Return potential' },
  { id: 'LOC', description: 'Location of company' },
  {
    id: 'CHAR',
    description:
      'CEO characteristics (e.g., passion, ability to communicate, demeanor, trustworthiness, confidence, etc.)',
  },
  { id: 'TEAM', description: 'Team composition' },
  { id: 'BOARD', description: 'Potential for involvement or Board seat' },
  { id: 'UNIV', description: 'University affiliation' },
  { id: 'SIZEFUND', description: 'Size of fundraise' },
];

export class criteriaType1631936316741 implements MigrationInterface {
  name = 'criteriaType1631936316741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
