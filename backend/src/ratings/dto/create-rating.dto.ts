import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRatingDto {
  @Type(() => Number)
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must not exceed 5' })
  value!: number;
}
