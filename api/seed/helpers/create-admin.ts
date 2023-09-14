import { getContainer } from '../../src/core/di';
import { getDBConnection } from '../../src/db/connection';
import { UserInviteService } from '../../src/modules/identity/user-invite/user-invite.service';
import { UserService } from '../../src/modules/identity/user/user.service';

export const createAdmin = async function createAdmin() {
  await getDBConnection();

  const userService = getContainer(UserService);
  const userInviteService = getContainer(UserInviteService);

  try {
    const adminEmail = 'admin@scroobious.com';
    const userInvite = await userInviteService.create(
      {
        email: adminEmail,
        userType: 'ADMIN',
      },
      '1'
    );

    await userService.register({
      name: 'Admin',
      profilePictureFileId:
        'https://pbs.twimg.com/profile_images/1421124036055244802/58IiFrIQ_400x400.jpg',
      email: adminEmail,
      password: 'asdfasdf',
      confirmPassword: 'asdfasdf',
      type: 'ADMIN',
    });
  } catch (error) {
    // console.log('admin@scroobious.com already exists');
  }
};
