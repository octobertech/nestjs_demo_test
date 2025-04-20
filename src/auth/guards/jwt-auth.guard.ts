// src/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
 
  handleRequest(err, user, info) {
    if (err || !user) {
      // Provide a more specific error message if possible (e.g., based on info)
      const message = info instanceof Error ? info.message : 'Unauthorized';
      throw err || new UnauthorizedException(message);
    }
    // If authentication is successful, Passport attaches the user (returned from JwtStrategy.validate)
    // to the request object, and we return it here.
    return user;
  }
}