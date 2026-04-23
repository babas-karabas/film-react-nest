import { Controller, Post, Body } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    const name = body?.name;
  }
}
