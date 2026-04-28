import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { FilmModule } from '../films/films.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [FilmModule],
})
export class OrderModule {}