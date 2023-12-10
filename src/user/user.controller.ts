import { Controller, Get, Req, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';
import { GetUser } from '../auth/decorator/user.decorator';


@Controller('users')
export class UserController {
    // @UseGuards(AuthGuard('jwt'))
    @UseGuards(MyJwtGuard)
    @Get('me')
    me(@GetUser() user: User){
        return user;
    }
}
