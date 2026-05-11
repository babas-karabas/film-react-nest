import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film, Schedule } from '../repository/film.entity';

@Module({
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository],
  imports: [TypeOrmModule.forFeature([Film, Schedule])],
  exports: [FilmsRepository],
})
export class FilmModule {}
