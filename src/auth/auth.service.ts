import { forwardRef, Inject, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) return user;
    }
    return null;
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { id: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '24h',
      }),
    };
  }
}
