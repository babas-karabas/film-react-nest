import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { TicketDTO, CreateOrderDto } from './dto/order.dto';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(private readonly filmRepository: FilmsRepository) { }

  async sendOrder(tickets: TicketDTO[]): Promise<CreateOrderDto> {
    try {
      const takenTickets = await Promise.all(
        tickets.map(async (ticket) => {

          try {
            const schedule = await this.filmRepository.getFilmScheduleById(ticket.film);
            if (!schedule) {
              throw new BadRequestException('Фильм не найден');
            }

          const session = schedule.items.find(i => i.id === ticket.session);
            if (!session) {
              throw new BadRequestException('Сеанс не найден');
            };

          const taken = session.taken;
          const userTicket = taken.find((t) => t === `${ticket.row}:${ticket.seat}`);
            if (userTicket) {
              throw new BadRequestException('Выбранное место уже занято');
            }

          if (ticket.row > session.rows && ticket.seat > session.seats) {
              throw new BadRequestException('Выбранное место или ряд не существует');
          }

          return this.filmRepository.takeTicket(ticket);
        } catch (err) {
      throw new InternalServerErrorException('Ошибка при заказе билета');

          }
        })
      );

      return {
        total: takenTickets.length,
        items: takenTickets
      }
    } catch (err) {
      throw new InternalServerErrorException('Ошибка при заказе билета');
    }
  }
}
  
    

