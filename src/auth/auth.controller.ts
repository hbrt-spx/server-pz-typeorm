import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../auth/dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    return this.authService.login(user.email, user.password);
  }

   @UseGuards(JwtAuthGuard)
  @Get('get-user')
  async getUser(@Request() req) {
    // O usuário é automaticamente disponibilizado no objeto req após a validação do guard
    return req.user; // Retorna o usuário encontrado no token
  }
}
