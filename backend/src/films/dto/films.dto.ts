export class FilmDTO {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
};

export class GetFilmsDTO {
  total: number;
  items: FilmDTO[]
};

export class ScheduleDTO {
  id: string; 
  daytime: string;
  hall: string;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
};

export class GetScheduleDTO {
  total: number;
  items: ScheduleDTO[]
};
