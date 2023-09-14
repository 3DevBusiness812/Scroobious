import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

export async function loadConfig() {
  // .local files are for secrets, load those first
  const files = ['.env', '.env.local', `.env.${process.env.NODE_ENV}.local`];
  let config = {};

  let result: { parsed?: object; error?: object } | undefined = {};
  files.forEach((filename: string) => {
    const filepath = path.join(process.cwd(), filename);
    if (fs.existsSync(filepath)) {
      result = dotenv.config({ path: filepath }).parsed;
      if (result) {
        config = { ...config, ...result };
      }
    }
  });

  return config;
}
