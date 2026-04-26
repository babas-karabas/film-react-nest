import { Injectable } from '@nestjs/common';
import { Film, Schedule } from './film.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class FilmsService {
  constructor(@InjectModel('Film') private readonly filmModel: Model<Film>) { }

  async getAllFilms(): Promise<Film[]> {
    try {
      const films = await this.filmModel.find().exec();
        if (films.length === 0) {
          throw new NotFoundException('Фильмы не найдены')
        }
      return films;
    } catch (err) {
      throw new InternalServerErrorException('Ошибка при получении фильмов: ' + err);
    }
  }


  async getScheduleById(id: string): Promise<Schedule[]> {
    try {
      const film = await this.filmModel.findById(id).exec();
        if (!film) {
          throw new NotFoundException('Фильм не найден');
        }
      return film.schedule;
    } catch (err) {
      throw new InternalServerErrorException('Ошибка при получении расписания: ' + err);
    }
  }
}
