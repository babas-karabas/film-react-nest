import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { GetFilmsDTO, GetScheduleDTO } from '../films/dto/films.dto';
import { TicketDTO } from '../order/dto/order.dto';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Film, Schedule } from './film.entity';

interface TFilmsRepository {
  getAllFilms(): Promise<GetFilmsDTO>;
  getFilmScheduleById(id: string): Promise<GetScheduleDTO>;
  takeTicket(ticket: TicketDTO): Promise<TicketDTO>;
}

@Injectable()
export class FilmsRepository implements TFilmsRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Film)
    private readonly films: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly schedule: Repository<Schedule>,
    @Inject('APP_LOGGER') private logger: LoggerService,
  ) {}

  async getAllFilms(): Promise<GetFilmsDTO> {
    this.logger.log('Getting films from the database...', 'FilmsRepository');
    const [films, count] = await this.films.findAndCount();
    this.logger.log(
      `The films were successfully received from the database. Count: ${count}`,
      'FilmsRepository',
    );
    return {
      total: count,
      items: films,
    };
  }

  async getFilmScheduleById(id: string): Promise<GetScheduleDTO> {
    this.logger.log(
      `Getting the schedule ${id} from the database...`,
      'FilmsRepository',
    );
    const [seanses, count] = await this.schedule.findAndCountBy({
      film: {
        id: id,
      },
    });
    this.logger.log(
      `The schedule was successfully received from the database. Count of seanses: ${count}`,
      'FilmsRepository',
    );

    return {
      total: count,
      items: seanses,
    };
  }

  async takeTicket(ticket: TicketDTO): Promise<TicketDTO> {
    this.logger.log(
      `Ordering ticket for the film ${ticket.film} on the session ${ticket.session} to the seat ${ticket.row}:${ticket.seat} from the database...`,
      'FilmsRepository',
    );
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    this.logger.log('Starting the transaction...', 'FilmsRepository');

    try {
      const seanse = await this.schedule.findOne({
        where: {
          id: ticket.session,
        },
        select: ['id', 'taken'],
      });

      if (!seanse) {
        await queryRunner.rollbackTransaction();
        throw new Error('Сеанс не найден');
      }

      if (seanse.taken.includes(`${ticket.row}:${ticket.seat}`)) {
        await queryRunner.rollbackTransaction();
        throw new Error('Выбранное место уже занято');
      }

      seanse.taken.push(`${ticket.row}:${ticket.seat}`);
      await queryRunner.manager.save(seanse);
      this.logger.log(
        `The seat ${ticket.row}:${ticket.seat} has been saved as occupied in the database`,
        'FilmsRepository',
      );
      await queryRunner.commitTransaction();
      this.logger.log('The transaction is completed', 'FilmsRepository');
      return ticket;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.log('The transaction has been roolbacked', 'FilmsRepository');
      throw err;
    } finally {
      await queryRunner.release();
      this.logger.log('The queryRunner has been released', 'FilmsRepository');
    }
  }
}
