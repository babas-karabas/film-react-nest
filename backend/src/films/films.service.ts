import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { GetFilmsDTO, GetScheduleDTO } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmRepository: FilmsRepository) { }

  async getAllFilms(): Promise<GetFilmsDTO> {
    const response = await this.filmRepository.getAllFilms();
      return response;
  }

  async getScheduleById(id: string): Promise<GetScheduleDTO> {
    const schedule = await this.filmRepository.getFilmScheduleById(id);
    return schedule;
  }
}
