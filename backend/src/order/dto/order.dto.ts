export class TicketDTO {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
};

export class TakenTicketDTO extends TicketDTO {
  id: string;
}

export class CreateOrderDto {
  total: number;
  items: TakenTicketDTO[];
};