// src/auth/auth.controller.ts
import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto'; 

@Controller('auth') // Route prefix for auth endpoints
export class AuthController {
  constructor(private authService: AuthService) {}

  // Use the LocalAuthGuard to trigger the LocalStrategy validation
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) { // Added LoginDto for clarity, though not strictly needed by LocalAuthGuard
    // If LocalAuthGuard passes, it attaches the user object (from LocalStrategy.validate) to req.user
    // We pass this user object to the login service method to get the JWT
    return this.authService.login(req.user);
  }

  // We could add a /register endpoint here later if needed
  // Or a /profile endpoint protected by JwtAuthGuard to return logged-in user info
}