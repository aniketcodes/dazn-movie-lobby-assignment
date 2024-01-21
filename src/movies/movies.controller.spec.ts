import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { SearchMovieDto } from './dto/search-movie.dto';
import { ResponseObject } from './def/response.def';
import { ResponseHandlerService } from '../helpers/response-handler.service';
import { Movie } from './interfaces/movies.interface';
import { MovieIdDto } from './dto/common.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let moviesService: MoviesService;
  let responseHandlerService: ResponseHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            create: jest.fn(),
            search: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ResponseHandlerService,
          useValue: {
            response: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
    responseHandlerService = module.get<ResponseHandlerService>(
      ResponseHandlerService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie', async () => {
      const createMovieDto: CreateMovieDto = {
        name: 'The Dictator',
        genre: 'Comedy',
        streamingLink: 'https://www.example.com/dictator',
        rating: 3.5,
      };

      const expectedResult: ResponseObject<any> = {
        status: HttpStatus.CREATED,
        message: 'Movie created',
        data: createMovieDto,
      };

      jest
        .spyOn(moviesService, 'create')
        .mockResolvedValue(expectedResult.data);

      const result = await controller.create(createMovieDto);

      expect(result).toEqual(expectedResult);
      expect(moviesService.create).toHaveBeenCalledWith(createMovieDto);
    });

    it('should handle errors during movie creation', async () => {
      const createMovieDto: CreateMovieDto = {
        name: 'The Dictator',
        genre: 'Comedy',
        streamingLink: 'https://www.example.com/dictator',
        rating: 3.5,
      };

      const error = new Error('Some error during movie creation');
      jest.spyOn(moviesService, 'create').mockRejectedValue(error);

      const result = await controller.create(createMovieDto);

      expect(result).toBeUndefined();
    });
  });

  describe('search', () => {
    it('should return an array of movies', async () => {
      const searchMovieDto: SearchMovieDto = {
        name: 'abc',
        genre: 'abc',
      };

      const expectedResult: ResponseObject<any> = {
        status: HttpStatus.OK,
        message: 'Movies fetched',
        data: [
          {
            name: 'The Dictator',
            genre: 'Comedy',
            streamingLink: 'https://www.example.com/dictator',
            rating: 3.5,
          },
        ],
      };

      jest
        .spyOn(moviesService, 'search')
        .mockResolvedValue(expectedResult.data);

      const result = await controller.search(searchMovieDto);

      expect(result).toEqual(expectedResult);
      expect(moviesService.search).toHaveBeenCalledWith(searchMovieDto);
    });

    it('should handle errors during movie search', async () => {
      const searchMovieDto: SearchMovieDto = {
        name: 'abc',
        genre: 'abc',
      };

      const error = new Error('Some error during movie search');
      jest.spyOn(moviesService, 'search').mockRejectedValue(error);

      const result = await controller.search(searchMovieDto);

      expect(result).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const expectedResult: ResponseObject<any> = {
        status: HttpStatus.OK,
        message: 'Movies fetched',
        data: [
          {
            name: 'The Dictator',
            genre: 'Comedy',
            streamingLink: 'https://www.example.com/dictator',
            rating: 3.5,
          },
        ],
      };

      jest
        .spyOn(moviesService, 'findAll')
        .mockResolvedValue(expectedResult.data);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(moviesService.findAll).toHaveBeenCalled();
    });

    it('should handle errors during movie retrieval', async () => {
      const error = new Error('Some error during movie retrieval');
      jest.spyOn(moviesService, 'findAll').mockRejectedValue(error);

      const result = await controller.findAll();

      expect(result).toBeUndefined();
      // Handle error based on your application logic
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const params: MovieIdDto = {
        id: '65aca09ebc8fdb0c060c422a',
      };
      const updateMovieDto: UpdateMovieDto = {
        name: 'The Dictator',
        genre: 'Comedy',
        streamingLink: 'https://www.example.com/dictator',
        rating: 3.5,
      };

      const expectedResult: ResponseObject<any> = {
        status: HttpStatus.OK,
        message: 'Movie updated',
        data: {
          name: 'The Dictator',
          genre: 'Comedy',
          streamingLink: 'https://www.example.com/dictator',
          rating: 3.5,
        },
      };

      jest
        .spyOn(moviesService, 'update')
        .mockResolvedValue(expectedResult.data);

      const result = await controller.update(params, updateMovieDto);

      expect(result).toEqual(expectedResult);
      expect(moviesService.update).toHaveBeenCalledWith(
        params.id,
        updateMovieDto,
      );
    });

    it('should handle movie not found', async () => {
      const params: MovieIdDto = {
        id: 'nonexistent-id',
      };
      const updateMovieDto: UpdateMovieDto = {
        name: 'The Dictator',
        genre: 'Comedy',
        streamingLink: 'https://www.example.com/dictator',
        rating: 3.5,
      };

      jest.spyOn(moviesService, 'update').mockResolvedValue(undefined);

      const error = new Error('Some error during movie creation');
      jest.spyOn(moviesService, 'update').mockRejectedValue(error);
      const result = await controller.update(params, updateMovieDto);

      expect(moviesService.update).toHaveBeenCalledWith(
        params.id,
        updateMovieDto,
      );
    });

    it('should handle errors during movie update', async () => {
      const params: MovieIdDto = {
        id: '65aca09ebc8fdb0c060c422a',
      };
      const updateMovieDto: UpdateMovieDto = {
        name: 'The Dictator',
        genre: 'Comedy',
        streamingLink: 'https://www.example.com/dictator',
        rating: 3.5,
      };

      const error = new Error('Some error during movie update');
      jest.spyOn(moviesService, 'update').mockRejectedValue(error);

      const result = await controller.update(params, updateMovieDto);

      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete a movie', async () => {
      const params: MovieIdDto = {
        id: '65aca09ebc8fdb0c060c422a',
      };

      const expectedResult: ResponseObject<Movie> = {
        status: HttpStatus.OK,
        message: 'Movie deleted',
        data: null,
      };

      jest.spyOn(moviesService, 'delete').mockResolvedValue(null);

      const result = await controller.delete(params);

      expect(result).toEqual(expectedResult);
      expect(moviesService.delete).toHaveBeenCalledWith(params.id);
    });

    it('should handle movie not found during deletion', async () => {
      const params: MovieIdDto = {
        id: 'nonexistent-id',
      };

    });

    it('should handle errors during movie deletion', async () => {
      const params: MovieIdDto = {
        id: '65aca09ebc8fdb0c060c422a',
      };

      const error = new Error('Some error during movie deletion');
      jest.spyOn(moviesService, 'delete').mockRejectedValue(error);

      const result = await controller.delete(params);

      expect(result).toBeUndefined();
      // Handle error based on your application logic
    });
  });
});
