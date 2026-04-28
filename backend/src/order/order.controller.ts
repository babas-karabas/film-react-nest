import { Controller, Post, Body } from '@nestjs/common';
import { CreateOrderDto, TakenTicketsDTO } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  public async create(@Body() order: CreateOrderDto): Promise<TakenTicketsDTO> {
     return await this.orderService.sendOrder(order.tickets);
  };
}

