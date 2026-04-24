import { Controller, Get, Param } from '@nestjs/common';

@Controller('films')
export class FilmsController {
  @Get()
  findAll(): string {
    return films;
  }
  @Get(':id/schedule')
  find(@Param('id') id: string): string {
    return film;
  }
}
