import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-ZÁ-Úa-zá-ú]+(\s[A-ZÁ-Úa-zá-ú]+)+$/, 
    { message: 'It is necessary to fill in your first and last' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?\/~\\|-]).*$/, 
    { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.' })
  password: string;
}
