import { MigrationInterface, QueryRunner } from 'typeorm';
import { createPermission, createRolePermission } from '../helpers/permissions';

export class addPitchFeedbackPermissions1646460017878 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createPermission('pitch_written_feedback:list', 'List pitch written feedback');

    await createRolePermission('founder', 'pitch_written_feedback:list');
    await createRolePermission('admin', 'pitch_written_feedback:list');
    await createRolePermission('reviewer', 'pitch_written_feedback:list');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No down
  }
}
