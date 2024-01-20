import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './interfaces/movies.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SearchMovieDto } from './dto/search-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel('Movie')
    private movieModel: Model<Movie>,
  ) {}
  async create(createMovieDto: CreateMovieDto) {
    return await this.movieModel.create(createMovieDto);
  }

  async search(searchMovieDto: SearchMovieDto) {
    const { genre, name } = searchMovieDto;

    const orQuery = [];

    if (genre) {
      const regex = new RegExp(genre);
      orQuery.push({
        genre: regex,
      });
    }

    if (name) {
      const regex = new RegExp(name, 'i');
      orQuery.push({
        name: regex,
      });
    }

    const query = {};

    if (orQuery?.length > 0) {
      Object.assign(query, {
        $or: orQuery,
      });
    }
    return await this.movieModel.find(query);
  }

  async findAll() {
    return await this.movieModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} movie`;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    return await this.movieModel.findByIdAndUpdate(id, updateMovieDto, {
      new: true,
    });
  }

  async delete(id: string) {
    return await this.movieModel.deleteOne({
      _id: id,
    });
  }
}
