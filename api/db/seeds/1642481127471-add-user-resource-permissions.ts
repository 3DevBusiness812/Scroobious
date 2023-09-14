import 'reflect-metadata';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { createPermission, createRolePermission } from '../helpers/permissions';

export class addUserResourcePermissions1642481127471 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createPermission('user:list', 'List Users');
    await createPermission('user:create', 'Create User');
    await createPermission('user:delete', 'Delete User');

    await createRolePermission('admin', 'user:list');
    await createRolePermission('admin', 'user:create');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
