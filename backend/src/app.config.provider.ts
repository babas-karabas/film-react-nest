import { ConfigModule } from '@nestjs/config';

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useValue: {
    database: {
      host: process.env.DATABASE_URL,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
    },
  },
};
