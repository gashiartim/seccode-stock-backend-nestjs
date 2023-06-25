import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  UsePipes,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoggedUser } from 'src/common/decorators/user.decorator';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { IsAuthenticated } from 'src/auth/jwt-auth.guard';

// @UsePipes(new ValidationPipe())
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async register(@Body() auth: RegisterUserDto, @Res() res: any): Promise<any> {
    const user = await this.userService.register(auth);

    return res.json({
      success: 'You have successfully registered!',
      user: user,
    });
  }

  @Post('/login')
  async login(@Body() auth: LoginUserDto): Promise<any> {
    return await this.userService.login(auth);
  }

  @UseGuards(IsAuthenticated)
  @ApiBearerAuth()
  @Get('/me')
  async me(@Request() req): Promise<any> {
    return await this.userService.profile(req);
  }
}
