import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { TicketDTO, TakenTicketsDTO } from './dto/order.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(
    private readonly filmRepository: FilmsRepository,
    @Inject('APP_LOGGER') private logger: LoggerService,
  ) {}

  async sendOrder(tickets: TicketDTO[]): Promise<TakenTicketsDTO> {
    const takenTickets = await Promise.all(
      tickets.map(async (ticket) => {
        this.logger.log(
          `Try to take ticket for the film ${ticket.film} on the session ${ticket.session} to the seat ${ticket.row}:${ticket.seat}`,
          'OrderService',
        );

        const schedule = await this.filmRepository.getFilmScheduleById(
          ticket.film,
        );
        if (!schedule) {
          this.logger.error(
            `The schedule for the film ${ticket.film} has not been found`,
            'OrderService',
          );
          throw new NotFoundException('Фильм не найден');
        }
        this.logger.log(
          `The schedule for the film ${ticket.film} has been found`,
          'OrderService',
        );

        const session = schedule.items.find((i) => i.id === ticket.session);
        if (!session) {
          this.logger.error(
            `The seanse ${ticket.session} for the film ${ticket.film} has not been found`,
            'OrderService',
          );
          throw new NotFoundException('Сеанс не найден');
        }
        this.logger.log(
          `The seanse ${ticket.session} for the film ${ticket.film} has been found`,
          'OrderService',
        );

        const userTicket = session.taken.find(
          (t) => t === `${ticket.row}:${ticket.seat}`,
        );
        if (userTicket) {
          this.logger.error(
            `The seat ${ticket.row}:${ticket.seat} on session ${ticket.session} for the film ${ticket.film} is not available`,
            'OrderService',
          );
          throw new ConflictException('Выбранное место не доступно для заказа');
        }
        this.logger.log(
          `The seat ${ticket.row}:${ticket.seat} on session ${ticket.session} for the film ${ticket.film} is available`,
          'OrderService',
        );

        if (
          ticket.row > session.rows ||
          ticket.seat > session.seats ||
          ticket.row <= 0 ||
          ticket.seat <= 0
        ) {
          this.logger.error(
            `The seat ${ticket.row}:${ticket.seat} on session ${ticket.session} for the film ${ticket.film} does not exist`,
            'OrderService',
          );
          throw new NotFoundException('Выбранное место или ряд не существует');
        }
        return await this.filmRepository.takeTicket(ticket);
      }),
    );
    this.logger.log(
      `All nessesary seats on session ${takenTickets[0].session} for the film ${takenTickets[0].film} are ordered`,
      'OrderService',
    );
    return {
      total: takenTickets.length,
      items: takenTickets,
    };
  }
}
