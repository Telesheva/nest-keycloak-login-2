import { Module } from '@nestjs/common';
import { KeycloakConnectModule } from './keycloak-connect.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [KeycloakConnectModule.register({
    authServerUrl: 'http://localhost:8080/auth',
    realm: 'ExampleRealm',
    clientId: 'ExampleRealm'
  })],
  providers: [
    AppService,
  ],
  controllers: [AppController]
})
export class AppModule {}
