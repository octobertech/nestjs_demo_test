// src/auth/strategies/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service'; // Inject UsersService if needed to check if user exists/is active

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { // Default 'jwt' strategy name
  constructor(
    // Optionally inject UsersService to perform extra validation based on payload
    // private usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Standard way to extract JWT
      ignoreExpiration: false, // Ensure expired tokens are rejected
      secretOrKey: process.env.JWT_SECRET || 'DEV_SECRET_FALLBACK', // !! IMPORTANT: Use the same secret as in AuthModule !!
    });
  }

  // This method is called by Passport after verifying the JWT signature and expiration
  // The 'payload' is the decoded JWT content (whatever AuthService put into it)
  async validate(payload: any) {
    // Here you can add logic based on the payload.
    // E.g., check if user ID from payload exists in the database.
    // For this example, we assume the payload structure includes user ID and email/username.
    // We directly return the payload, which Passport will attach to request.user

    // Example payload structure we'll use later in AuthService: { email: user.email, sub: user.id }
    if (!payload || !payload.sub || !payload.email) {
        throw new UnauthorizedException('Invalid token payload');
    }

    // Optional: Fetch user from DB based on payload.sub (user id) to ensure they still exist/aren't banned etc.
    // const user = await this.usersService.findOne(payload.sub);
    // if (!user) {
    //   throw new UnauthorizedException('User associated with token not found');
    // }

    // Return the payload (or the user object fetched from DB)
    // Passport attaches this to request.user
    return { userId: payload.sub, email: payload.email };
  }
}
