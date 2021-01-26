import {
  Injectable,
  Inject,
  Scope,
  UnauthorizedException, Logger,
} from '@nestjs/common';
import requestPromise = require('request-promise');
import { KeycloakConnectOptions } from './interface/keycloak-connect-options.interface';
import { KEYCLOAK_CONNECT_OPTIONS, KEYCLOAK_INSTANCE } from './constants';
import { KeycloakedRequest } from './keycloaked-request';
import { REQUEST } from '@nestjs/core';
import { Keycloak } from 'keycloak-connect';

@Injectable({ scope: Scope.REQUEST })
export class KeycloakService {
  private readonly logger = new Logger(KeycloakService.name);

  constructor(
    @Inject(KEYCLOAK_INSTANCE) private keycloak: Keycloak,
    @Inject(KEYCLOAK_CONNECT_OPTIONS) private options: KeycloakConnectOptions,
    @Inject(REQUEST) private request: KeycloakedRequest<Request>
  ) {}
  async login(
    username: string,
    password: string,
    scope = 'openid profile ',
  ): Promise<unknown> {
    let res;
    try {
      res = await requestPromise.post(
        `${this.options.authServerUrl}/realms/${this.options.realm}/protocol/openid-connect/token`,
        {
          form: {
            grant_type: 'password',
            "client_id": this.options.clientId,
            "client_secret": this.options.secret,
            scope: scope,
            username: username,
            password: password,
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );
        
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    if (typeof res === 'string' && res.indexOf('access_token') !== -1) {
      this.request.session.token = res;
      try {
        this.request.grant = await this.keycloak.grantManager.createGrant({
          "access_token": JSON.parse(res).access_token
        }) as any;
      } catch (error) {
        throw new UnauthorizedException(error);
      }
      return true;
    }

    return false;
  }
}
