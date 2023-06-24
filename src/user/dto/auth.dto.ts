import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, Length } from 'class-validator';
import { SameAs } from 'src/common/decorators/validation.decorator';

export class RegisterUserDto {
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsDefined()
  @Length(6)
  @ApiProperty()
  @SameAs('password_confirm', {
    message: "Password confirmation doesn't match.",
  })
  password: string;

  @IsNotEmpty()
  @IsDefined()
  @Length(6)
  @ApiProperty()
  passwordConfirm: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsDefined()
  @Length(6)
  @ApiProperty()
  password: string;
}
