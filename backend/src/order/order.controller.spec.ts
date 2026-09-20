import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { expect, describe, it, jest, beforeEach } from '@jest/globals';
import { OrderService } from './order.service';
import { CreateOrderDto, TicketDTO } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const OrderServiceMock = {
    sendOrder: jest.fn(),
  };

  const loggerServiceMock = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: OrderServiceMock,
        },
        {
          provide: 'APP_LOGGER',
          useValue: loggerServiceMock,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('.create() should call sendOrder() method of the service', () => {
    const req: CreateOrderDto = {
      email: 'test@mail.ru',
      phone: '+7-920-355-62-48',
      tickets: [
        {
          day: '12 июня',
          film: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
          session: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
          daytime: '2024-06-28T10:00:53+03:00',
          row: 4,
          seat: 5,
          price: 350,
          time: '12 часов',
        },
        {
          day: '12 июня',
          film: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
          session: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
          daytime: '2024-06-28T10:00:53+03:00',
          row: 4,
          seat: 6,
          price: 350,
          time: '12 часов',
        },
      ],
    };

    const tickets: TicketDTO[] = [
      {
        day: '12 июня',
        film: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
        session: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
        daytime: '2024-06-28T10:00:53+03:00',
        row: 4,
        seat: 5,
        price: 350,
        time: '12 часов',
      },
      {
        day: '12 июня',
        film: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
        session: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
        daytime: '2024-06-28T10:00:53+03:00',
        row: 4,
        seat: 6,
        price: 350,
        time: '12 часов',
      },
    ];

    controller.create(req);

    expect(service.sendOrder).toHaveBeenCalledWith(tickets);
  });
});
