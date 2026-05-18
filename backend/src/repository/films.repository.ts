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
    this.logger.log({
      context: FilmsRepository,
      message: 'Getting films from the database...',
    });
    const [films, count] = await this.films.findAndCount();
    this.logger.log({
      context: FilmsRepository,
      message: `The films were successfully received from the database. Count: ${count}`,
    });
    return {
      total: count,
      items: films,
    };
  }

  async getFilmScheduleById(id: string): Promise<GetScheduleDTO> {
    this.logger.log({
      context: FilmsRepository,
      message: `Getting the schedule ${id} from the database...`,
    });
    const [seanses, count] = await this.schedule.findAndCountBy({
      film: {
        id: id,
      },
    });
    this.logger.log({
      context: FilmsRepository,
      message: `The schedule was successfully received from the database. Count of seanses: ${count}`,
    });

    return {
      total: count,
      items: seanses,
    };
  }

  async takeTicket(ticket: TicketDTO): Promise<TicketDTO> {
    this.logger.log({
      context: FilmsRepository,
      message: `Ordering ticket for the film ${ticket.film} on the session ${ticket.session} to the seat ${ticket.row}:${ticket.seat} from the database...`,
    });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    this.logger.log({
      context: FilmsRepository,
      message: 'Starting the transaction...',
    });

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
      this.logger.log({
        context: FilmsRepository,
        message: `The seat ${ticket.row}:${ticket.seat} has been saved as occupied in the database`,
      });
      await queryRunner.commitTransaction();
      this.logger.log({
        context: FilmsRepository,
        message: 'The transaction is completed',
      });
      return ticket;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.log({
        context: FilmsRepository,
        message: 'The transaction has been roolbacked',
      });
      throw err;
    } finally {
      await queryRunner.release();
      this.logger.log({
        context: FilmsRepository,
        message: 'The queryRunner has been released',
      });
    }
  }
}
