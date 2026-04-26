import { Schema, Document } from 'mongoose';

export interface Schedule {
  id: string; 
  daytime: string;
  hall: string;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
};

export interface Film extends Document {
  _id: Schema.Types.ObjectId;
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: Schedule[];
};
