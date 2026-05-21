import { Controller, Get, Param, Inject, LoggerService } from '@nestjs/common';
import { FilmsService } from './films.service';
import { GetFilmsDTO, GetScheduleDTO } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(
    private readonly filmsService: FilmsService,
    @Inject('APP_LOGGER') private logger: LoggerService,
  ) {}

  @Get()
  public async findAllFilms(): Promise<GetFilmsDTO> {
    this.logger.log('Sending films...', 'FilmsController');
    return await this.filmsService.getAllFilms();
  }

  @Get(':id/schedule')
  public async findFilmSchedule(
    @Param('id') id: string,
  ): Promise<GetScheduleDTO> {
    this.logger.log(`Sending the schedule ${id}...`, 'FilmsController');
    return await this.filmsService.getScheduleById(id);
  }
}
