import { Controller, Post, Body } from '@nestjs/common';
import { CreateOrderDto, TicketDTO } from './dto/order.dto';
import { OrderService } from './order.service';
import { InternalServerErrorException } from '@nestjs/common';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  public async create(@Body() tickets: TicketDTO[]): Promise<CreateOrderDto> {
     return await this.orderService.sendOrder(tickets);
  };
}

