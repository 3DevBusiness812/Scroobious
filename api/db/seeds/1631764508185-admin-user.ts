import 'reflect-metadata';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { getContainer } from '../../src/core/di';
import { getDBConnection } from '../../src/db/connection';
import { UserInviteService } from '../../src/modules/identity/user-invite/user-invite.service';
import { UserService } from '../../src/modules/identity/user/user.service';
import { createUserRole } from '../helpers/permissions';

export class adminUser1631764508185 implements MigrationInterface {
  name = 'adminUser1631764508185';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!process.env.SCROOBIOUS_ADMIN_EMAIL) {
      throw new Error("Environment variable 'SCROOBIOUS_ADMIN_EMAIL' is required");
    }

    if (!process.env.SCROOBIOUS_ADMIN_DB_PASSWORD) {
      throw new Error("Environment variable 'SCROOBIOUS_ADMIN_DB_PASSWORD' is required");
    }

    await getDBConnection();
    const userService = getContainer(UserService);
    const userInviteService = getContainer(UserInviteService);

    await userInviteService.create(
      {
        email: process.env.SCROOBIOUS_ADMIN_EMAIL,
        userType: 'ADMIN',
      },
      '1'
    );

    const adminData = {
      name: 'Scroobious Admin',
      profilePictureFileId:
        'https://cdn.spark.app/media/scroobious/icon/scroobious_logo_final_04_crop2.png',
      email: process.env.SCROOBIOUS_ADMIN_EMAIL,
      type: 'ADMIN',
      password: process.env.SCROOBIOUS_ADMIN_DB_PASSWORD,
      confirmPassword: process.env.SCROOBIOUS_ADMIN_DB_PASSWORD,
    };

    const admin = await userService.register(adminData);
    // console.log('userService.register(adminData) :>> ', queryRunner.isTransactionActive);

    await createUserRole(admin.id, 'admin');

    // Create system admin user role
    await createUserRole('1', 'system-admin');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
