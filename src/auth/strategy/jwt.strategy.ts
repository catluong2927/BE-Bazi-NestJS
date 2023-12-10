import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        configService: ConfigService, 
        public prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET')
        });
    }
    async validate(payload: {sub: number; email: string}){
        const user = await this.prismaService.user.findUnique({
            where: {
                id: payload.sub
            }
        })
        delete user.hashedPassword
        return payload;
    }
}