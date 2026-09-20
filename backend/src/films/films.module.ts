import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film, Schedule } from '../repository/film.entity';
import { createLogger } from '../logger/logger.factory';

@Module({
  controllers: [FilmsController],
  providers: [
    FilmsService,
    FilmsRepository,
    {
      provide: 'APP_LOGGER',
      useFactory: createLogger,
    },
  ],
  imports: [TypeOrmModule.forFeature([Film, Schedule])],
  exports: [FilmsRepository],
})
export class FilmModule {}
