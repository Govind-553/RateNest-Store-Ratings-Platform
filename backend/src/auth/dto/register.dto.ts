import { IsEmail, IsNotEmpty, IsString, Length, Matches, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(20, 60, {
    message: 'Name must be between 20 and 60 characters',
  })
  name!: string;

  @IsEmail({}, { message: 'Invalid email address format' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/, {
    message:
      'Password must be 8-16 characters and contain at least one uppercase letter and one special character.',
  })
  password!: string;

  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  @MaxLength(400, {
    message: 'Address must not exceed 400 characters',
  })
  address!: string;
}
