import { Injectable } from '@nestjs/common';
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
  ) {}

  async getAllFilms(): Promise<GetFilmsDTO> {
    const [films, count] = await this.films.findAndCount();
    return {
      total: count,
      items: films,
    };
  }

  async getFilmScheduleById(id: string): Promise<GetScheduleDTO> {
    const [seanses, count] = await this.schedule.findAndCountBy({
      film: {
        id: id,
      },
    });
    return {
      total: count,
      items: seanses,
    };
  }

  async takeTicket(ticket: TicketDTO): Promise<TicketDTO> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

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
      await queryRunner.commitTransaction();
      return ticket;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
