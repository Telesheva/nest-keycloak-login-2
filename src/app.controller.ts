import { KeycloakService } from './keycloak.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { PublicPath } from './decorators/public-path.decorator';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private appService: AppService,
    private keycloakService: KeycloakService,
  ) {}

  @PublicPath()
  @Post('/login')
  async auth(@Body() body) {
    try {
      const res = await this.keycloakService.login(body.user, body.password);
      this.logger.log('USER IS AUTHENTICATED');
      return res;
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: e.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @PublicPath()
  @Get('/logout')
  logout(@Res() resp) {
    resp.status(302).redirect('/login');
  }
}
