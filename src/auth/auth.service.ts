/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Note } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable({})
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
        ){

    }
    async register(authDTO: AuthDTO){
        const hashPassword = await argon.hash(authDTO.password)
        try {
            const user = await this.prismaService.user.create({
                data: {
                    email: authDTO.email,
                    hashedPassword: hashPassword,
                    firstName: '',
                    lastName: '',
                },
                // chỉ show 3 trường id, email, createdat
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                }
            })
            return await this.signJwtToken(user.id, user.email)
        } catch (error) {
            if(error.code == 'P2002') {
                throw new ForbiddenException('Error in credentials')
            }
        }
    }
    async login(authDTO: AuthDTO){
        //find user = email
        const user = await this.prismaService
                        .user.findUnique({
                            where: {
                                email: authDTO.email
                            }
                        });
        if(!user){
            throw new ForbiddenException('User not found')
        }
        const passwordMatch = await argon.verify(
            user.hashedPassword,
            authDTO.password
        )
        if(!passwordMatch){
            throw new ForbiddenException('Incorrect password')
        } // sẽ hiện đầy đủ thông tin user bao gồm hashpass
        delete user.hashedPassword // xóa trường hashpass              
        return await this.signJwtToken (user.id, user.email)
    }

    async signJwtToken (userId: number, email: string)
        :Promise<{accessToken: string}>{
        const payload = {
            sub: userId,
            email
        }
        const jwtString = await this.jwtService.signAsync(payload, {
            expiresIn : '10m',
            secret: this.configService.get('JWT_SECRET'),
        })
        return {
          accessToken: jwtString, 
        }
    }
}