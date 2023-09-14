import { MigrationInterface, QueryRunner } from 'typeorm';
import { getListInsertStatement } from '../helpers/list';

const listName = 'accreditation_status';
const listItems = [
  {
    id: 'INCOME',
    description:
      'I have had $200K in income (or $300K jointly with my spouse) for the past 2 years and expect the same this year.',
  },
  {
    id: 'NET_ASSETS',
    description: 'I have over $1M in net assets, excluding my primary residence',
  },
  {
    id: 'LICENSED',
    description:
      'I am a holder in good standing of the Series 7, Series 65, or Series 82 licenses.',
  },
  {
    id: 'FUND_EMP',
    description: 'I am a “knowledgeable employee” of a fund with respect to private investments.',
  },
  {
    id: 'SPOUSE',
    description:
      'I am a “spousal equivalent” to the accredited investor definition, so that I may pool my finances for the purpose of qualifying as accredited investors.',
  },
  {
    id: 'ADVISOR',
    description: 'I am an SEC- or state-registered investment adviser.',
  },
];

export class accreditationStatus11631936215740 implements MigrationInterface {
  name = 'accreditationStatus11631936215740';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // console.log('queryRunner.connection :>> ', queryRunner.connection);
    // console.log('accreditationStatus11631936215740');
    await queryRunner.query(getListInsertStatement(listName, listItems));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
