import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

@Schema()
export class Schedule {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  daytime: string;
  @Prop({ required: true })
  hall: string;
  @Prop({ required: true })
  rows: number;
  @Prop({ required: true })
  seats: number;
  @Prop({ required: true })
  price: number;
  @Prop({ type: [String], required: true })
  taken: string[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
export type ScheduleDocument = HydratedDocument<Schedule>;

@Schema()
export class Film {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  rating: number;
  @Prop({ required: true })
  director: string;
  @Prop({ type: [String], required: true })
  tags: string[];
  @Prop({ required: true })
  image: string;
  @Prop({ required: true })
  cover: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  about: string;
  @Prop({ required: true })
  description: string;
  @Prop({ type: [ScheduleSchema], required: true })
  schedule: Schedule[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
export type FilmDocument = HydratedDocument<Film>;
