import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { GetFilmsDTO, GetScheduleDTO } from './dto/films.dto';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) { }

  @Get()
  public async findAllFilms(): Promise<GetFilmsDTO> {
    try {
      const res = await this.filmsService.getAllFilms();
        if (res.total === 0) {
          throw new NotFoundException('Фильмы не найдены')
        }
      return res;
    } catch (err) {
      throw new InternalServerErrorException('Ошибка при получении фильмов');
    }
  }

  @Get(':id/schedule')
  public async findFilmSchedule(@Param('id') id: string): Promise<GetScheduleDTO> {
    try {
      const res = await this.filmsService.getScheduleById(id);
        if (res.total === 0) {
          throw new NotFoundException('Расписание не найдено');
        }
      return res;
    } catch (err) {
      throw new InternalServerErrorException('Ошибка при получении расписания');
    }
  }
}
