import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Film {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  @Generated('uuid')
  id: string;

  @Column()
  rating: number;

  @Column()
  director: string;

  @Column()
  tags: string[];

  @Column()
  image: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column()
  about: string;

  @Column()
  description: string;

  @OneToMany(() => Schedule, (schedule) => schedule.filmId)
  schedule: Schedule[];
}

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  @Generated('uuid')
  id: string;

  @Column()
  daytime: string;

  @Column()
  hall: string;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column()
  price: number;

  @Column()
  taken: string[];

  @ManyToOne(() => Film, (film) => film.schedule)
  filmId: Film;
}
