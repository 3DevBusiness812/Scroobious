import { MigrationInterface, QueryRunner } from 'typeorm';
import { createPermission, createRolePermission } from '../helpers/permissions';

export class addPitchFeedbackPermissions1646460017876 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Pitch Written Feedback
    await createPermission('pitch_written_feedback:request', 'Request pitch written feedback');
    await createPermission('pitch_written_feedback:admin', 'Admin pitch written feedback');

    await createRolePermission('founder', 'pitch_written_feedback:request');
    await createRolePermission('admin', 'pitch_written_feedback:admin');
    await createRolePermission('reviewer', 'pitch_written_feedback:admin');

    // Pitch Meeting Feedback
    await createPermission('pitch_meeting_feedback:request', 'Request pitch meeting feedback');
    await createPermission('pitch_meeting_feedback:admin', 'Admin pitch meeting feedback');

    await createRolePermission('founder', 'pitch_meeting_feedback:request');
    await createRolePermission('admin', 'pitch_meeting_feedback:admin');
    await createRolePermission('reviewer', 'pitch_meeting_feedback:admin');

    // Reviewers need to list users
    await createRolePermission('reviewer', 'user:list');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No down
  }
}
