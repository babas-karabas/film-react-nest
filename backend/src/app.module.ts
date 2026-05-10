import { Module } from '@nestjs/common';

import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configProvider } from './app.config.provider';
import { FilmModule } from './films/films.module';
import { OrderModule } from './order/order.module';

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
    TypeOrmModule.forRoot({...configProvider.useValue.database,
      entities: [] }),
    FilmModule,
    OrderModule,
  ],
  providers: [configProvider],
})
export class AppModule {}
