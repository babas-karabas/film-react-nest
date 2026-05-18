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
        this.logger.log({
          context: OrderService,
          message: `Try to take ticket for the film ${ticket.film} on the session ${ticket.session} to the seat ${ticket.row}:${ticket.seat}`,
        });

        const schedule = await this.filmRepository.getFilmScheduleById(
          ticket.film,
        );
        if (!schedule) {
          this.logger.error({
            context: OrderService,
            message: `The schedule for the film ${ticket.film} has not been found`,
          });
          throw new NotFoundException('Фильм не найден');
        }
        this.logger.log({
          context: OrderService,
          message: `The schedule for the film ${ticket.film} has been found`,
        });

        const session = schedule.items.find((i) => i.id === ticket.session);
        if (!session) {
          this.logger.error({
            context: OrderService,
            message: `The seanse ${ticket.session} for the film ${ticket.film} has not been found`,
          });
          throw new NotFoundException('Сеанс не найден');
        }
        this.logger.log({
          context: OrderService,
          message: `The seanse ${ticket.session} for the film ${ticket.film} has been found`,
        });

        const userTicket = session.taken.find(
          (t) => t === `${ticket.row}:${ticket.seat}`,
        );
        if (userTicket) {
          this.logger.error({
            context: OrderService,
            message: `The seat ${ticket.row}:${ticket.seat} on session ${ticket.session} for the film ${ticket.film} is not available`,
          });
          throw new ConflictException('Выбранное место не доступно для заказа');
        }
        this.logger.log({
          context: OrderService,
          message: `The seat ${ticket.row}:${ticket.seat} on session ${ticket.session} for the film ${ticket.film} is available`,
        });

        if (
          ticket.row > session.rows ||
          ticket.seat > session.seats ||
          ticket.row <= 0 ||
          ticket.seat <= 0
        ) {
          this.logger.error({
            context: OrderService,
            message: `The seat ${ticket.row}:${ticket.seat} on session ${ticket.session} for the film ${ticket.film} does not exist`,
          });
          throw new NotFoundException('Выбранное место или ряд не существует');
        }
        return await this.filmRepository.takeTicket(ticket);
      }),
    );
    this.logger.log({
      context: OrderService,
      message: `All nessesary seats on session ${takenTickets[0].session} for the film ${takenTickets[0].film} are ordered`,
    });
    return {
      total: takenTickets.length,
      items: takenTickets,
    };
  }
}
