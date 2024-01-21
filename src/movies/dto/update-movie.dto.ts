import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
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
