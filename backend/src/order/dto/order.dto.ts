export class TicketDTO {
  day: string;
  daytime: string;
  film: string;
  price: number;
  row: number;
  seat: number;
  session: string;
  time: string;
}

export class CreateOrderDto {
  email: string;
  phone: string;
  tickets: TicketDTO[];
}

export class TakenTicketsDTO {
  total: number;
  items: TicketDTO[];
}
