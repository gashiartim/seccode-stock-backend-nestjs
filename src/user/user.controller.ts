import { Controller, Post, Body, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async register(@Body() auth: RegisterUserDto, @Res() res: any): Promise<any> {
    const user = await this.userService.register(auth);

    return res.json({
      success: 'You have successfully registered!',
      user: user.user,
      ...user,
    });
  }

  @Post('/login')
  async login(@Body() auth: LoginUserDto): Promise<any> {
    return await this.userService.login(auth);
  }
}
