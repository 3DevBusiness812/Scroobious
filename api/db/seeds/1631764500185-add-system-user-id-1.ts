import 'reflect-metadata';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { generateId } from 'warthog';
import { getContainer } from '../../src/core';
import { getDBConnection } from '../../src/db/connection';
import { UserInviteService } from '../../src/modules/identity/user-invite/user-invite.service';
import { UserService } from '../../src/modules/identity/user/user.service';
import { UserTypeService } from '../../src/modules/identity/user_type/user_type.service';
import { createPermission, createRole, createRolePermission } from '../helpers/permissions';

export class addSystemUserId1631764500185 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await getDBConnection();
    const userService = getContainer(UserService);
    const userInviteService = getContainer(UserInviteService);
    const userTypeService = getContainer(UserTypeService);

    const email = 'system@scroobious.com';
    const password = generateId();

    const systemAdminRole = await createRole('system-admin', 'System Admin');
    await createPermission('system:admin', 'System Admin (all permissions for all resources)');
    await createRolePermission('system-admin', 'system:admin');

    await userTypeService.create(
      {
        type: 'SYSTEM_ADMIN',
        defaultRole: systemAdminRole,
        allowedAtRegistration: false,
      },
      '1'
    );

    await userInviteService.create(
      {
        email,
        userType: 'SYSTEM_ADMIN',
      },
      '1'
    );

    await userService.register({
      id: '1',
      type: 'SYSTEM_ADMIN',
      name: 'Scroobious System',
      profilePictureFileId:
        'https://static2.srcdn.com/wordpress/wp-content/uploads/2020/01/dwight-schrute-office-featured.jpg?q=50&fit=crop&w=960&h=500&dpr=1.5',
      email,
      password,
      confirmPassword: password,
    } as any);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
