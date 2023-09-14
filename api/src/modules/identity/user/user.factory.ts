// https://github.com/thoughtbot/fishery
import { Factory } from 'fishery';
import { UserRegisterInput } from './user.schema';

export const UserFactory = Factory.define<UserRegisterInput>(() => {
  const key = new Date().getTime();

  return {
    name: `Test User ${key}`,
    profilePictureFileId:
      'https://media-exp1.licdn.com/dms/image/C4E03AQGKApN22tB-5Q/profile-displayphoto-shrink_800_800/0/1517683648335?e=1634169600&v=beta&t=6677dPZUl56yO58N82SGLgvaZfVGA6lWhbOyJ__hWnc',
    email: `test-user${key}@gmail.com`,
    type: 'FOUNDER_FULL',
    password: 'fakepassword',
    confirmPassword: 'fakepassword',
  };
});
