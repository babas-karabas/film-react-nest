import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { GetFilmsDTO, GetScheduleDTO } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  public async findAllFilms(): Promise<GetFilmsDTO> {
    return await this.filmsService.getAllFilms();
  }

  @Get(':id/schedule')
  public async findFilmSchedule(
    @Param('id') id: string,
  ): Promise<GetScheduleDTO> {
    return await this.filmsService.getScheduleById(id);
  }
}
