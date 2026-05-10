import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilmDTO,
  GetFilmsDTO,
  GetScheduleDTO,
  ScheduleDTO,
} from '../films/dto/films.dto';
import { Film, FilmDocument } from './films.schema';
import { TicketDTO } from '../order/dto/order.dto';

interface TFilmsRepository {
  getAllFilms(): Promise<GetFilmsDTO>;
  getFilmScheduleById(id: string): Promise<GetScheduleDTO>;
  takeTicket(ticket: TicketDTO): Promise<TicketDTO>;
}

@Injectable()
export class FilmsRepository implements TFilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
  ) {}

  private getFilmMapperFn(): (Film: FilmDocument) => FilmDTO {
    return (root) => {
      return {
        id: root.id,
        rating: root.rating,
        director: root.director,
        tags: root.tags,
        image: root.image,
        cover: root.cover,
        title: root.title,
        about: root.about,
        description: root.description,
      };
    };
  }

  private getFilmScheduleMapperFn(): (Schedule) => ScheduleDTO {
    return (root) => {
      return {
        id: root.id,
        daytime: root.daytime,
        hall: root.hall,
        rows: root.rows,
        seats: root.seats,
        price: root.price,
        taken: root.taken,
      };
    };
  }

  async getAllFilms(): Promise<GetFilmsDTO> {
    const films = await this.filmModel.find();
    return {
      total: films.length,
      items: films.map(this.getFilmMapperFn()),
    };
  }

  async getFilmScheduleById(id: string): Promise<GetScheduleDTO> {
    const film = await this.filmModel.findOne({ id: id });
    const schedule = film.schedule;
    return {
      total: schedule.length,
      items: schedule.map(this.getFilmScheduleMapperFn()),
    };
  }

  async takeTicket(ticket: TicketDTO): Promise<TicketDTO> {
    await this.filmModel.findOneAndUpdate(
      { id: ticket.film },
      {
        $push: { 'schedule.$[element].taken': `${ticket.row}:${ticket.seat}` },
      },
      { arrayFilters: [{ 'element.id': ticket.session }] },
    );
    return ticket;
  }
}
