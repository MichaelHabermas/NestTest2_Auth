import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { AuthDto } from './dto/authDto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: AuthDto) {
    return this.authService.login({ email, password });
  }

  @Post('signUp')
  @ApiOkResponse({ type: AuthEntity })
  signUp(@Body() { email, password }: AuthDto) {
    return this.authService.signUp({ email, password });
  }
}
