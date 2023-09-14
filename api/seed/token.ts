import * as fs from 'fs';
import path from 'path';
import { getContainer } from '../src/core/di';
import { UserLoginInput } from '../src/modules/identity/user/user.schema';
import { UserService } from '../src/modules/identity/user/user.service';

export async function writeM2MToken(input: UserLoginInput) {
  const userService = getContainer(UserService);
  const result = await userService.login({ email: input.email, password: input.password });
  // console.log(`result`, result);

  // Re-write our new admin auth token to .env.local
  const envLocalPath = path.join(__dirname, '../../', '.env.local');
  const authTokenLine = `M2M_API_TOKEN=${result.token}`;
  // console.log(`envLocalPath`, envLocalPath);

  try {
    if (!fs.existsSync(envLocalPath)) {
      fs.writeFileSync(envLocalPath, authTokenLine);
    } else {
      let data = fs.readFileSync(envLocalPath, 'utf8');
      // console.log(`data`, data);
      data = data.replace(/M2M\_API\_TOKEN=.*/g, authTokenLine);
      // console.log(`data2`, data);
      fs.writeFileSync(envLocalPath, data, 'utf8');
    }
  } catch (error) {
    // console.log('Error writing .env.local', error);
  }
}
