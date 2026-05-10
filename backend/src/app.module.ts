import { Module } from '@nestjs/common';

import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configProvider } from './app.config.provider';
import { FilmModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { Film, Schedule } from './repository/film.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
      exclude: ['/api/(.*)'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: configProvider.useValue.database.host,
      port: configProvider.useValue.database.port,
      username: configProvider.useValue.database.username,
      password: configProvider.useValue.database.password,
      database: configProvider.useValue.database.database,
      entities: [Film, Schedule],
      synchronize: configProvider.useValue.database.synchronize,
    }),
    FilmModule,
    OrderModule,
  ],
  providers: [configProvider],
})
export class AppModule {}
