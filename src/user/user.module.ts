import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthServiceGeneral } from 'src/services/auth/AuthService';
import { HashService } from 'src/services/hash/HashService';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, HashService, AuthServiceGeneral],
})
export class UserModule {}
