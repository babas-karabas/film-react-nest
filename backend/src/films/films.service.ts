import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { GetFilmsDTO, GetScheduleDTO } from './dto/films.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class FilmsService {
  constructor(
    private readonly filmRepository: FilmsRepository,
    @Inject('APP_LOGGER') private logger: LoggerService,
  ) {}

  async getAllFilms(): Promise<GetFilmsDTO> {
    const response = await this.filmRepository.getAllFilms();
    if (response.total === 0) {
      this.logger.error('The films have not been found', 'FilmsService');
      throw new NotFoundException('Фильмы не найдены');
    }
    this.logger.log('The films have been sent', 'FilmsService');
    return response;
  }

  async getScheduleById(id: string): Promise<GetScheduleDTO> {
    const response = await this.filmRepository.getFilmScheduleById(id);
    if (response.total === 0) {
      this.logger.error('The schedule has not been found', 'FilmsService');
      throw new NotFoundException('Расписание не найдено');
    }
    this.logger.log(`The schedule ${id} has been sent`, 'FilmsService');
    return response;
  }
}
