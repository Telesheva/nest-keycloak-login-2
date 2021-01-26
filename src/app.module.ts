import { Module } from '@nestjs/common';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeycloakService } from './keycloak.service';

@Module({
  imports: [KeycloakConnectModule.register({
    authServerUrl: 'http://localhost:8080/auth',
    realm: 'Demo-realm',
    clientId: 'demo-app',
    secret: 'secret',
  })],
  providers: [
    AppService,
    KeycloakService,
  ],
  controllers: [AppController]
})
export class AppModule {}
