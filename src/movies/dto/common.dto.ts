import { IsMongoId } from 'class-validator';

export class MovieIdDto {
  @IsMongoId()
  id: string;
}
