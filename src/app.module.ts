import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
// import { config } from 'dotenv';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule, 
    NoteModule, 
    PrismaModule,

  ],
})
export class AppModule {}
