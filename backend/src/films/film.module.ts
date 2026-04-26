import { Module } from "@nestjs/common";
import { FilmsController } from "./films.controller";
import { FilmsService } from "./films.service";
import { MongooseModule } from "@nestjs/mongoose";
import { FilmSchema } from "./film.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: 'Film', schema: FilmSchema
        }])
    ],
    controllers: [FilmsController],
    providers: [FilmsService]
})
export class FilmModule {}

