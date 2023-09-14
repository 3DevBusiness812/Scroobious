// Run:
//   SKIP_DB_CREATION=true yarn test ./src/modules/identity/user.test.ts --watch --detectOpenHandles
import 'reflect-metadata';
import { getRandomEmail } from '../../../test/common';
import { TestServerService } from '../../../test/server';
import { callAPIError, callAPISuccess, getContainer } from '../../core';
import { UserInviteStatus } from './user-invite/user-invite.model';
import { UserStatus } from './user/user.model';

let testServer: TestServerService;
beforeAll(async () => {
  testServer = await getContainer(TestServerService).start();
});

afterAll(async () => {
  await testServer.stop();
});

describe('User', () => {
  describe('Reviewer', () => {
    test('Created successfully when invited', async () => {
      const noAuthBinding = await testServer.getNoAuthBinding();
      const systemBinding = await testServer.getSystemAdminAuthBinding();
      const email = getRandomEmail();

      await systemBinding.mutation.createUserInvite({
        data: { email, userType: 'REVIEWER' },
      });
      // console.log('createUserInviteResult :>> ', createUserInviteResult);

      const user = await callAPISuccess(
        noAuthBinding.mutation.register(
          {
            data: {
              name: `Test User`,
              profilePictureFileId:
                'https://cdn.spark.app/media/scroobious/icon/scroobious_logo_final_04_crop2.png',
              email,
              password: 'fake password',
              confirmPassword: 'fake password',
              type: 'REVIEWER',
            },
          },
          '{ id status capabilities firstName }'
        )
      );

      expect(user.status).toBe(UserStatus.ACTIVE);
      expect(user.capabilities).toEqual(['REVIEWER']);
      expect(user.firstName).toEqual('Test');

      // The UserInvite should be ACCEPTED
      const userInvites = await callAPISuccess(
        systemBinding.query.userInvites({ where: { email_eq: email } })
      );

      expect(userInvites.length).toBe(1);
      expect(userInvites?.[0].status).toBe(UserInviteStatus.ACCEPTED);
    });

    test('Fails when not invited', async () => {
      const noAuthBinding = await testServer.getNoAuthBinding();
      const email = getRandomEmail();

      const error = await callAPIError(
        noAuthBinding.mutation.register(
          {
            data: {
              name: `Test User`,
              profilePictureFileId:
                'https://cdn.spark.app/media/scroobious/icon/scroobious_logo_final_04_crop2.png',
              email,
              password: 'fake password',
              confirmPassword: 'fake password',
              type: 'REVIEWER',
            },
          },
          '{ id, status, capabilities }'
        )
      );

      expect(error.message).toContain('Unable to register as a REVIEWER');
    });
  });
});
