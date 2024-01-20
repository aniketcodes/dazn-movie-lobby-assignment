import { Movie } from '../interfaces/movies.interface';
export class CreateMovieDto implements Movie {
  name: string;
  genre: string;
  streamingLink: string;
  rating: number;
}
