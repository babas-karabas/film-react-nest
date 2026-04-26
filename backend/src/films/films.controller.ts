import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { GetFilmDTO, GetFilmScheduleDTO } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  public async findAllFilms(): Promise<GetFilmDTO[]> {
    const films = await this.filmsService.getAllFilms();
    return films;
  }

  @Get(':id/schedule')
  public async findFilmSchedule(@Param('id') id: string): Promise<GetFilmScheduleDTO[]> {
    const schedule = this.filmsService.getScheduleById(id);
    return schedule;
  }
}
