import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor(...filePaths: string[]) {
    let envConfig: Record<string, string> = {};

    for (const file of filePaths) {
      try {
        envConfig = {
          ...envConfig,
          ...dotenv.parse(fs.readFileSync(path.join(__dirname, '../../', file)))
        };
      } catch {}
    }

    this.envConfig = envConfig;
  }

  get(key: string): string;
  get(key: string[]): string[];
  get(key: string | string[]): string | string[] {
    const getter = (key: string) => process.env[key] || this.envConfig[key];

    if (Array.isArray(key)) {
      return key.map(getter);
    }

    return getter(key);
  }
}
