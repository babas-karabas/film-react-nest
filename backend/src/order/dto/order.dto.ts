import {
  ArrayNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class TicketDTO {
  @IsString()
  day: string;
  @IsDateString()
  daytime: string;
  @IsString()
  film: string;
  @IsNumber()
  price: number;
  @IsNumber()
  row: number;
  @IsNumber()
  seat: number;
  @IsString()
  session: string;
  @IsString()
  time: string;
}

export class CreateOrderDto {
  @IsEmail()
  email: string;
  @IsPhoneNumber()
  phone: string;
  @ArrayNotEmpty()
  tickets: TicketDTO[];
}

export class TakenTicketsDTO {
  total: number;
  items: TicketDTO[];
}
