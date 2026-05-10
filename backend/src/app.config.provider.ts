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
      type: 'postgres',
      host: process.env.DATABASE_URL,
      port: process.env.DATABASE_PORT,
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
    },
  },
};
