import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { expect, describe, it, jest, beforeEach } from '@jest/globals';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const filmsServiceMock = {
    getAllFilms: jest.fn(),
    getScheduleById: jest.fn(),
  };

  const loggerServiceMock = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: filmsServiceMock,
        },
        {
          provide: 'APP_LOGGER',
          useValue: loggerServiceMock,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  it('.findAllFilms() should call getAllFilms() method of the service', () => {
    controller.findAllFilms();

    expect(service.getAllFilms).toHaveBeenCalled();
  });

  it('.findFilmSchedule() should call getScheduleById() method of the service', () => {
    const id = '92b8a2a7-ab6b-4fa9-915b-d27945865e39';
    controller.findFilmSchedule(id);

    expect(service.getScheduleById).toHaveBeenCalledWith(id);
  });
});
