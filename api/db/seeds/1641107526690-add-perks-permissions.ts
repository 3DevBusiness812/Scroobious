import { MigrationInterface, QueryRunner } from 'typeorm';
import { createPermission, createRolePermission } from '../helpers/permissions';

export class addPerksPermissions1641107526690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createPermission('perk:list', 'List perks');
    await createPermission('perk:create', 'Create a perk');
    await createPermission('perk:update', 'Update a perk');

    await createRolePermission('admin', 'perk:list');
    await createRolePermission('founder', 'perk:list');

    await createRolePermission('admin', 'perk:create');
    await createRolePermission('admin', 'perk:update');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No down
  }
}
