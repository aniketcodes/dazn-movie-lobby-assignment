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
import { ResponseHandlerService } from '../helpers/response-handler.service';
import { Movie } from './interfaces/movies.interface';
import { ResponseObject } from './def/response.def';
import { Roles } from '../guards/roles.decorator';
import { Role } from '../guards/roles.enum';
import { RolesGuard } from '../guards/roles.guard';
import { SearchMovieDto } from './dto/search-movie.dto';
import { MovieIdDto } from './dto/common.dto';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('movies')
@UseGuards(RolesGuard)
export class MoviesController {
  constructor(
    private responseHandlerService: ResponseHandlerService,
    private readonly moviesService: MoviesService,
  ) {}

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiHeader({
    name: 'role',
    description: 'Pass admin for admin roles else null',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Movie created successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Requires admin role',
  })
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
  @ApiOperation({ summary: 'Returns an array of movies based on search' })
  @ApiQuery({
    name: 'name',
    example: 'dictator',
    required: false,
  })
  @ApiQuery({
    name: 'genre',
    example: 'comedy',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movies fetched',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  async search(@Query() searchMovieDto: SearchMovieDto) {
    try {
      const result: Movie[] = (await this.moviesService.search(
        searchMovieDto,
      )) as Movie[];

      const response: ResponseObject<Movie[]> = {
        status: HttpStatus.OK,
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
  @ApiOperation({ summary: 'Returns all the movies' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movies fetched',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  async findAll() {
    try {
      const result: Movie[] = (await this.moviesService.findAll()) as Movie[];

      const response: ResponseObject<Movie[]> = {
        status: HttpStatus.OK,
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

  @Put(':id')
  @Roles(Role.Admin)
  @ApiParam({
    name: 'id',
    required: true,
    example: '65aca09ebc8fdb0c060c422a (MongoId)',
  })
  @ApiOperation({ summary: 'Updates movie' })
  @ApiHeader({
    name: 'role',
    description: 'Pass admin for admin roles else null',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movie updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Movie not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Requires admin role',
  })
  async update(
    @Param() params: MovieIdDto,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    try {
      const result: Movie | undefined = (await this.moviesService.update(
        params?.id,
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
  @ApiOperation({ summary: 'Deletes movie' })
  @ApiParam({
    name: 'id',
    required: true,
    example: '65aca09ebc8fdb0c060c422a (MongoId)',
  })
  @ApiHeader({
    name: 'role',
    description: 'Pass admin for admin roles else null',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movie deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Movie not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Requires admin role',
  })
  async delete(@Param() params: MovieIdDto) {
    try {
      const result = await this.moviesService.delete(params?.id);

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
