import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilmDTO, GetFilmsDTO, GetScheduleDTO, ScheduleDTO } from '../films/dto/films.dto';
import { Film } from './films.schema';

@Injectable()
export class FilmsRepository {
  constructor(@InjectModel('Film') private readonly filmModel: typeof Film) { }

  private getFilmMapperFn(): (Film) => FilmDTO {
    return root => {
      return {
        id: root.id,
        rating: root.rating,
        director: root.director,
        tags: root.tags,
        image: root.image,
        cover: root.cover,
        title: root.title,
        about: root.about,
        description: root.description
      }
    }
  }

  private getFilmScheduleMapperFn(): (Schedule) => ScheduleDTO {
    return root => {
      return {
        id: root.id, 
        daytime: root.daytime,
        hall: root.hall,
        rows: root.rows,
        seats: root.seats,
        price: root.price,
        taken: root.taken,
      }
    }
  }

  async getAllFilms(): Promise<GetFilmsDTO> {
    const films = await this.filmModel.find().exec();
    return {
      total: films.length,
      items: films.map(this.getFilmMapperFn())
    }
  }

  async getFilmScheduleById(id: string): Promise<GetScheduleDTO> {
    const film = await this.filmModel.findOne({ id: id }).exec();
    const schedule = film.schedule;
    return {
      total: schedule.length,
      items: schedule.map(this.getFilmScheduleMapperFn())
    }
  }
}
