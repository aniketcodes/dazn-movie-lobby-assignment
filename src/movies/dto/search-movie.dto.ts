import { IsOptional, IsString } from 'class-validator';
export class SearchMovieDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  genre?: string;
}
