import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateStoreDto {
  @IsString({ message: 'Store name must be a string' })
  @IsNotEmpty({ message: 'Store name is required' })
  @MaxLength(100, { message: 'Store name cannot exceed 100 characters' })
  name!: string;

  @IsEmail({}, { message: 'Invalid store email address' })
  @IsNotEmpty({ message: 'Store email is required' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
  email!: string;

  @IsString({ message: 'Store address must be a string' })
  @IsNotEmpty({ message: 'Store address is required' })
  @MaxLength(400, { message: 'Store address cannot exceed 400 characters' })
  address!: string;

  @IsOptional()
  @IsString({ message: 'Owner ID must be a string' })
  ownerId?: string;
}
