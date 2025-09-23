import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import * as jwksRsa from 'jwks-rsa'

@Injectable()
export class AzureADStrategy extends PassportStrategy(Strategy, 'azure-ad') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/discovery/v2.0/keys`,
      }),
      audience: process.env.AZURE_CLIENT_ID,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0`,
      algorithms: ['RS256'],
      passReqToCallback: false, // necháš false, validate dostane iba payload
    })
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Invalid token')
    }

    // Tu môžeš validovať scope
    if (!payload.scp || !payload.scp.includes('user_auth')) {
      throw new UnauthorizedException('Missing required scope')
    }

    return {
      oid: payload.oid,
      email: payload.preferred_username,
      name: payload.name,
      scopes: payload.scp,
    }
  }
}
