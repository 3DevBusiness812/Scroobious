// Run:
//   SKIP_DB_CREATION=true yarn test ./src/modules/identity/user.test.ts --watch --detectOpenHandles
import { nanoid } from 'nanoid';
import 'reflect-metadata';
import { Binding } from '../../../../generated/binding';
import { createUser } from '../../../../test/common';
import { TestServerService } from '../../../../test/server';
import { callAPIError, callAPISuccess, getContainer } from '../../../core';
// import { UserService } from '../user/user.service';
import { PasswordResetService } from './password-reset.service';

let testServer: TestServerService;
let noAuthBinding: Binding;
beforeAll(async () => {
  testServer = await getContainer(TestServerService).start();
  noAuthBinding = await testServer.getNoAuthBinding();
});

afterAll(async () => {
  await testServer.stop();
});

describe('PasswordReset', () => {
  // TODO: Returns same response for valid and invalid email

  test('Successful happy path', async () => {
    const originalPassword = nanoid(20);
    const { user: founderUser } = await createUser(noAuthBinding, 'FOUNDER_FULL', originalPassword);
    // console.log('founderUser :>> ', founderUser);
    const email = founderUser.email;

    const originalLoginResult = await callAPISuccess(
      noAuthBinding.mutation.login({
        data: {
          email,
          password: originalPassword,
        },
      })
    );
    expect(originalLoginResult.token.length).toBeTruthy();

    const requestResetResult = await callAPISuccess(
      noAuthBinding.mutation.requestPasswordReset({
        data: { email },
      })
    );

    expect(requestResetResult).toBe(true);

    const passwordResetService = getContainer(PasswordResetService);
    const passwordResets = await passwordResetService.find({ email_eq: email });
    expect(passwordResets.length).toBe(1);

    const passwordReset = passwordResets[0];
    const token = passwordReset.token;
    expect(token.length).toBe(64);

    const password = nanoid(20);

    const executeResetResult = await callAPISuccess(
      noAuthBinding.mutation.executePasswordReset({
        data: { token, password, confirmPassword: password },
      })
    );
    // console.log('executeResetResult :>> ', executeResetResult);
    expect(executeResetResult).toBe(true);

    // const userService = getContainer(UserService);
    // const user = await userService.findOne({ id: founderUser.id });
    // console.log('user.password :>> ', user.password);

    // Logging in with original password gives error
    const originalPasswordAgainResult = await callAPIError(
      noAuthBinding.mutation.login({
        data: {
          email,
          password: originalPassword,
        },
      })
    );
    expect(originalPasswordAgainResult.message).toContain('Invalid email/password');

    // Logging in with new password is successful
    const loginResult = await callAPISuccess(
      noAuthBinding.mutation.login({
        data: {
          email,
          password,
        },
      })
    );
    expect(loginResult.token.length).toBeTruthy();
  });

  test('Bad token throws an error', async () => {
    const password = nanoid(20);
    const { user: founderUser } = await createUser(noAuthBinding, 'FOUNDER_FULL', password);
    const email = founderUser.email;

    await callAPISuccess(
      noAuthBinding.mutation.requestPasswordReset({
        data: { email },
      })
    );

    const token = 'definitely-not-the-right-token';

    const executeResetResult = await callAPIError(
      noAuthBinding.mutation.executePasswordReset({
        data: { token, password, confirmPassword: password },
      })
    );

    expect(executeResetResult.message).toContain('Unable to find');
  });
});
