import 'reflect-metadata';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { getContainer } from '../../src/core/di';
import { getDBConnection } from '../../src/db/connection';
import { RoleService } from '../../src/modules/access-management/role/role.service';
import { UserTypeService } from '../../src/modules/identity/user_type/user_type.service';

export class userTypes1631764502185 implements MigrationInterface {
  name = 'userTypes1631764502185';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await getDBConnection();
    const userTypeService = getContainer(UserTypeService);
    const roleService = getContainer(RoleService);

    const investorRole = await roleService.findOne({ code: 'investor' });
    await userTypeService.create(
      {
        type: 'INVESTOR',
        defaultRole: investorRole,
        allowedAtRegistration: true,
      },
      '1'
    );

    const founderRole = await roleService.findOne({ code: 'founder' });
    await userTypeService.create(
      {
        type: 'FOUNDER',
        defaultRole: founderRole,
        allowedAtRegistration: true,
      },
      '1'
    );

    const adminRole = await roleService.findOne({ code: 'admin' });
    await userTypeService.create(
      {
        type: 'ADMIN',
        defaultRole: adminRole,
        allowedAtRegistration: false,
      },
      '1'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
