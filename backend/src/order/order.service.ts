import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { TicketDTO, TakenTicketsDTO } from './dto/order.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(private readonly filmRepository: FilmsRepository) {}

  async sendOrder(tickets: TicketDTO[]): Promise<TakenTicketsDTO> {
    const takenTickets = await Promise.all(
      tickets.map(async (ticket) => {
        const schedule = await this.filmRepository.getFilmScheduleById(
          ticket.film,
        );
        if (!schedule) {
          throw new NotFoundException('Фильм не найден');
        }
        const session = schedule.items.find((i) => i.id === ticket.session);
        if (!session) {
          throw new NotFoundException('Сеанс не найден');
        }

        const userTicket = session.taken.find(
          (t) => t === `${ticket.row}:${ticket.seat}`,
        );
        if (userTicket) {
          throw new ConflictException('Выбранное место уже занято');
        }

        if (
          ticket.row > session.rows ||
          ticket.seat > session.seats ||
          ticket.row <= 0 ||
          ticket.seat <= 0
        ) {
          throw new NotFoundException('Выбранное место или ряд не существует');
        }
        return await this.filmRepository.takeTicket(ticket);
      }),
    );

    return {
      total: takenTickets.length,
      items: takenTickets,
    };
  }
}
