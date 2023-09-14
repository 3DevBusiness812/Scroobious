import 'reflect-metadata';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { getContainer } from '../../src/core/di';
import { getDBConnection } from '../../src/db/connection';
import { RoleService } from '../../src/modules/access-management/role/role.service';
import { UserTypeService } from '../../src/modules/identity/user_type/user_type.service';

export class addFounderUserTypes1647488334659 implements MigrationInterface {
  name = 'addFounderUserTypes1647488334659';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await getDBConnection();
    const userTypeService = getContainer(UserTypeService);
    const roleService = getContainer(RoleService);

    const founderLiteRole = await roleService.findOne({ code: 'founder-lite' });
    await userTypeService.create(
      {
        type: 'FOUNDER_LITE',
        defaultRole: founderLiteRole,
        allowedAtRegistration: true,
      },
      '1'
    );

    const founderMediumRole = await roleService.findOne({ code: 'founder-medium' });
    await userTypeService.create(
      {
        type: 'FOUNDER_MEDIUM',
        defaultRole: founderMediumRole,
        allowedAtRegistration: true,
      },
      '1'
    );

    const founderFullRole = await roleService.findOne({ code: 'founder-full' });
    await userTypeService.create(
      {
        type: 'FOUNDER_FULL',
        defaultRole: founderFullRole,
        allowedAtRegistration: true,
      },
      '1'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
