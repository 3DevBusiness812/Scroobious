import { MigrationInterface, QueryRunner } from 'typeorm';
import { createPermission, createRolePermission } from '../helpers/permissions';

export class addPitchFeedbackPermissions1646460019999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createPermission('pitch_meeting_feedback:list', 'List pitch meeting feedback');

    await createRolePermission('founder', 'pitch_meeting_feedback:list');
    await createRolePermission('admin', 'pitch_meeting_feedback:list');
    await createRolePermission('reviewer', 'pitch_meeting_feedback:list');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No down
  }
}
