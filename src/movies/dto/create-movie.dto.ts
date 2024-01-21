import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '../interfaces/movies.interface';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
export class CreateMovieDto implements Movie {
  @ApiProperty({
    example: 'The Dictator',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Comedy',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  genre: string;

  @ApiProperty({
    example: 'https://www.example.com/dictator',
    required: true,
  })
  @IsUrl()
  @IsNotEmpty()
  streamingLink: string;

  @ApiProperty({
    example: 3.5,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  rating: number;
}
