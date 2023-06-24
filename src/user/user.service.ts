import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashService } from 'src/services/hash/HashService';
import { AuthServiceGeneral } from 'src/services/auth/AuthService';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly hashService: HashService,
    private readonly authService: AuthServiceGeneral,
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

    const { password, ...userWithoutPassword } = user;

    return this.authService.sign(
      {
        userId: user.id,
      },
      { user: { ...userWithoutPassword, id: user.id, email: user.email } },
    );
  }

  public async login(data: LoginUserDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({
        email: data.email,
      })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new HttpException('User does not exists!', HttpStatus.NOT_FOUND);
    }

    if (!(await this.hashService.compare(data.password, user.password))) {
      throw new HttpException(
        'Password does not match!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.authService.sign(
      { userId: user.id, email: user.email },
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    );
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
}
