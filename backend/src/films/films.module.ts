import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmSchema, ScheduleSchema } from '../repository/films.schema';

@Module({
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository],
  imports: [MongooseModule.forFeature([{ name: 'Film', schema: FilmSchema }, { name: 'Schedule', schema: ScheduleSchema }])],
  exports: [FilmsRepository],
})
export class FilmModule {}

