import 'reflect-metadata';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { createPermission, createRolePermission } from '../helpers/permissions';

export class addInsightsPermissions1647498957779 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // console.log('rolesAndPermissions1631764501185 up: getting DB connection');

    await createPermission('founder_insights:list', 'See founder insights');
    await createPermission('investor_insights:list', 'See investor insights');

    await createRolePermission('founder-medium', 'founder_insights:list');
    await createRolePermission('founder-full', 'founder_insights:list');

    await createRolePermission('investor', 'investor_insights:list');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
