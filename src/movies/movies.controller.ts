import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Query,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ResponseHandlerService } from 'src/helpers/response-handler.service';
import { Movie } from './interfaces/movies.interface';
import { ResponseObject } from './def/response.def';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from 'src/guards/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { SearchMovieDto } from './dto/search-movie.dto';

@Controller('movies')
@UseGuards(RolesGuard)
export class MoviesController {
  constructor(
    private responseHandlerService: ResponseHandlerService,
    private readonly moviesService: MoviesService,
  ) {}

  @Post()
  @Roles(Role.Admin)
  async create(
    @Body() createMovieDto: CreateMovieDto,
  ): Promise<ResponseObject<Movie>> {
    try {
      const result: Movie = (await this.moviesService.create(
        createMovieDto,
      )) as Movie;
      const response: ResponseObject<Movie> = {
        status: HttpStatus.CREATED,
        message: 'Movie created',
        data: result,
      };
      return response;
    } catch (e) {
      await this.responseHandlerService.response(
        e,
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
      );
    }
  }

  @Get('/search')
  async search(@Query() searchMovieDto: SearchMovieDto) {
    try {
      const result: Movie[] = (await this.moviesService.search(
        searchMovieDto,
      )) as Movie[];

      const response: ResponseObject<Movie[]> = {
        status: HttpStatus.CREATED,
        message: 'Movies fetched',
        data: result,
      };
      return response;
    } catch (e) {
      await this.responseHandlerService.response(
        e,
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const result: Movie[] = (await this.moviesService.findAll()) as Movie[];

      const response: ResponseObject<Movie[]> = {
        status: HttpStatus.CREATED,
        message: 'Movies fetched',
        data: result,
      };
      return response;
    } catch (e) {
      await this.responseHandlerService.response(
        e,
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Put(':id')
  @Roles(Role.Admin)
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    try {
      const result: Movie | undefined = (await this.moviesService.update(
        id,
        updateMovieDto,
      )) as Movie | undefined;

      if (!result) {
        throw new NotFoundException('Movie Not found');
      }
      const response: ResponseObject<Movie> = {
        status: HttpStatus.OK,
        message: 'Movie updated',
        data: result,
      };
      return response;
    } catch (e) {
      await this.responseHandlerService.response(
        e,
        e?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
        null,
      );
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: string) {
    try {
      const result = await this.moviesService.delete(id);

      if (result?.deletedCount == 0) {
        throw new NotFoundException('Movie Not found');
      }
      const response: ResponseObject<Movie> = {
        status: HttpStatus.OK,
        message: 'Movie deleted',
        data: null,
      };
      return response;
    } catch (e) {
      await this.responseHandlerService.response(
        e,
        e?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
        null,
      );
    }
  }
}
