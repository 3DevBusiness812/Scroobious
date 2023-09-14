import { MigrationInterface, QueryRunner } from 'typeorm';
import { deleteRolePermission } from '../helpers/permissions';

export class deleteReviewerAdminPermissions1671852622000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await deleteRolePermission('reviewer', 'pitch:admin');
    await deleteRolePermission('reviewer', 'user:list');
    await deleteRolePermission('reviewer', 'pitch_meeting_feedback:list');
    await deleteRolePermission('reviewer', 'pitch_meeting_feedback:admin');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No up
  }
}
