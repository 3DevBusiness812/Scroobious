import 'reflect-metadata';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { createPermission, createRolePermission } from '../helpers/permissions';

export class moreFounderLiteFomo1648870554566 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createPermission(
      'founder_insights:fomo',
      'Give access to see some info about PiP to generate fomo'
    );

    await createRolePermission('founder-lite', 'founder_insights:fomo');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
