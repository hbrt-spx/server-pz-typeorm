import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';  // Importe o AuthService onde você verifica o JWT

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,  // Ou outro valor para a chave secreta
    });
  }

  async validate(payload: any) {
    // Você pode pegar a informação do payload do JWT e usá-la para verificar no seu banco de dados
    return { userId: payload.sub, email: payload.email };
  }
}
