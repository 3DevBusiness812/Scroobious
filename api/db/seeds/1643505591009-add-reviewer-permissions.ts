import { MigrationInterface, QueryRunner } from 'typeorm';
import { createPermission, createRolePermission } from '../helpers/permissions';

export class addReviewerPermissions1643505591011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createPermission('pitch:admin', 'Admin Pitches');

    await createRolePermission('reviewer', 'pitch:admin');
    await createRolePermission('reviewer', 'pitch:publish');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No down
  }
}
