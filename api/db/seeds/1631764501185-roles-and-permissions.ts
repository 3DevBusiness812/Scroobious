import 'reflect-metadata';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { createPermission, createRole, createRolePermission } from '../helpers/permissions';

export class rolesAndPermissions1631764501185 implements MigrationInterface {
  name = 'rolesAndPermissions1631764501185';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // console.log('rolesAndPermissions1631764501185 up: getting DB connection');

    await createRole('admin', 'Admin');
    await createRolePermission('admin', 'system:admin');

    await createRole('investor', 'Investor');
    await createRole('founder', 'Founder');

    await createPermission('pitch:list', 'List Pitches');
    await createPermission('conversation_message:list', 'List Conversation Messages');
    await createPermission('course:list', 'List Courses');
    await createPermission('pitch:create', 'Create Pitch');
    await createPermission('insights:list', 'List Insights');

    await createRolePermission('investor', 'pitch:list');
    await createRolePermission('investor', 'conversation_message:list');
    await createRolePermission('investor', 'insights:list');

    await createRolePermission('founder', 'course:list');
    await createRolePermission('founder', 'pitch:create');
    await createRolePermission('founder', 'conversation_message:list');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
