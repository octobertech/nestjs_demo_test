import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, 
  ) {}

  // Called by LocalStrategy
  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null> {
    // Find user by email (we need the password hash for comparison)
    // Note: findByEmail in UsersService should return the full User object OR null
    const user = await this.usersService.findByEmail(email);

    // Check if user exists and password is correct
    if (user && await bcrypt.compare(pass, user.password)) {
      // Password matches. Return user object *without* the password hash.
      const { password, ...result } = user;
      return result;
    }
    // User not found or password incorrect
    return null;
  }

  // Called after successful validation to generate JWT
  async login(user: Omit<User, 'password'>) {
    // Payload contains the claims we want to include in the JWT
    // Standard practice is to include user ID ('sub' for subject) and maybe username/email/roles
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload), // Generate the token
    };
  }

  // Potential future methods: register, refresh token, etc.
}