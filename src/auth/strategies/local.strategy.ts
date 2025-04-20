// src/auth/strategies/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) { // Default 'local' strategy name
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  // This method is called by Passport when the 'local' strategy is used (e.g., via LocalAuthGuard)
  async validate(email: string, pass: string): Promise<any> {
    const user = await this.authService.validateUser(email, pass);
    if (!user) {
      // Passport automatically converts this to a 401 Unauthorized response
      throw new UnauthorizedException('Invalid credentials');
    }
    // Passport attaches the returned value (the user object without password) to request.user
    return user;
  }
}