import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'Current password must be a string' })
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword!: string;

  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  @Matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/, {
    message:
      'New password must be 8-16 characters and contain at least one uppercase letter and one special character.',
  })
  newPassword!: string;
}
