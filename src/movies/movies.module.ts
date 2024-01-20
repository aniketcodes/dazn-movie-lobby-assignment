import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieSchema } from './schemas/movies.schema';
import { ResponseHandlerService } from 'src/helpers/response-handler.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Movie', schema: MovieSchema }]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, ResponseHandlerService],
  exports: [MoviesService],
})
export class MoviesModule {}
