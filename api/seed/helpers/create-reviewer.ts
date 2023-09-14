import { getContainer } from '../../src/core/di';
import { getDBConnection } from '../../src/db/connection';
import { UserInviteService } from '../../src/modules/identity/user-invite/user-invite.service';
import { UserService } from '../../src/modules/identity/user/user.service';

export const createReviewer = async function createAdmin() {
  await getDBConnection();

  const userService = getContainer(UserService);
  const userInviteService = getContainer(UserInviteService);

  try {
    const reviewerEmail = 'reviewer@scroobious.com';
    await userInviteService.create(
      {
        email: reviewerEmail,
        userType: 'REVIEWER',
      },
      '1'
    );

    await userService.register({
      name: 'Reviewer',
      profilePictureFileId:
        'https://pbs.twimg.com/profile_images/1421124036055244802/58IiFrIQ_400x400.jpg',
      email: reviewerEmail,
      password: 'asdfasdf',
      confirmPassword: 'asdfasdf',
      type: 'REVIEWER',
    });
  } catch (error) {
    // console.log('reviewer@scroobious.com already exists');
  }
};
