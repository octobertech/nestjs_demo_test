import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module'; 
import { PassportModule } from '@nestjs/passport'; 
import { JwtModule } from '@nestjs/jwt'; 
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy'; 

@Module({
  imports: [
    UsersModule, // Make UsersService available for injection
    PassportModule, // Basic setup for passport
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'DEV_SECRET_FALLBACK', // !! IMPORTANT: Use environment variable in production !!
      signOptions: { expiresIn: '60m' }, // Token expires in 60 minutes
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy], 
  controllers: [AuthController], 
  exports: [AuthService, JwtModule], // Export AuthService 
})
export class AuthModule {}