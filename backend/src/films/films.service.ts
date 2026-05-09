import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { GetFilmsDTO, GetScheduleDTO } from './dto/films.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class FilmsService {
  constructor(private readonly filmRepository: FilmsRepository) {}

  async getAllFilms(): Promise<GetFilmsDTO> {
    const response = await this.filmRepository.getAllFilms();
    if (response.total === 0) {
      throw new NotFoundException('Фильмы не найдены');
    }
    return response;
  }

  async getScheduleById(id: string): Promise<GetScheduleDTO> {
    const response = await this.filmRepository.getFilmScheduleById(id);
    if (response.total === 0) {
      throw new NotFoundException('Расписание не найдено');
    }
    return response;
  }
}
