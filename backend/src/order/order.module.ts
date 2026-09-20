import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { FilmModule } from '../films/films.module';
import { createLogger } from '../logger/logger.factory';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: 'APP_LOGGER',
      useFactory: createLogger,
    },
  ],
  imports: [FilmModule],
})
export class OrderModule {}
