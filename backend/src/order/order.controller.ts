import { Controller, Post, Body, Inject, LoggerService } from '@nestjs/common';
import { CreateOrderDto, TakenTicketsDTO } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject('APP_LOGGER') private logger: LoggerService,
  ) {}

  @Post()
  public async create(@Body() order: CreateOrderDto): Promise<TakenTicketsDTO> {
    this.logger.log('Сreating the order...', 'OrderController');
    return await this.orderService.sendOrder(order.tickets);
  }
}
