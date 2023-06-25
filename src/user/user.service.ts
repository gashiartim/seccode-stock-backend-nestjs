import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashService } from 'src/services/hash/HashService';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  public async register(data: RegisterUserDto) {
    await this.checkIfEmailExists(data.email);

    let user = await this.userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });

    await this.userRepository.save(user);

    user = await this.userRepository
      .createQueryBuilder('user')
      .where({ id: user.id })
      .getOne();

    return user;
  }

  public async login(data: LoginUserDto) {
    const user = await this.findUserByEmail(data.email);

    if (!user) {
      throw new HttpException('Invalid credentials!', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (isMatch) {
      const { access_token } = await this.authService.login(user);

      return {
        access_token,
        user,
      };
    }
  }

  async profile(req) {
    const user = req.user;

    return await this.userRepository
      .createQueryBuilder('user')
      .where({ id: user.id })
      .getOne();
  }

  public async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    return user;
  }

  public async checkIfEmailExists(email: string) {
    const user = await this.getUserByEmail(email);

    if (user) {
      throw new HttpException('Email already exists!', HttpStatus.FOUND);
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password'],
    });
  }
}
