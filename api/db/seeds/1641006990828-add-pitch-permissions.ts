import { MigrationInterface, QueryRunner } from 'typeorm';
import { getContainer } from '../../src/core';
import { UserTypeService } from '../../src/modules/identity/user_type/user_type.service';
import { createPermission, createRole, createRolePermission } from '../helpers/permissions';

export class addPitchPermissions1641006990828 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userTypeService = getContainer(UserTypeService);

    const reviewer = await createRole('reviewer', 'Reviewer');
    await createRole('admin', 'Admin');

    // Create the Reviewer user type
    await userTypeService.create(
      {
        type: 'REVIEWER',
        defaultRoleId: reviewer.id,
        allowedAtRegistration: false,
      },
      '1'
    );

    await createPermission('pitch:publish', 'Publish a pitch to the investor portal');
    await createPermission('pitch:review', 'Review founder pitches');

    await createRolePermission('reviewer', 'pitch:review');
    await createRolePermission('admin', 'pitch:publish');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No down
  }
}
