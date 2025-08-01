import { IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Username is not empty' })
  accountName: string;

  @IsNotEmpty({ message: 'Password is not empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}
