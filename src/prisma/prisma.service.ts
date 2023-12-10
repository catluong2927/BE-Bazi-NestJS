import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
// import { config } from 'dotenv';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          // url: 'postgresql://postgres:Abcd123456789@localhost:5434/postgres?schema=public',
          // url: process.env.DATABASE_URL,
          url: configService.get('DATABASE_URL')
        },
      },
    });
  }
  cleanDatabase(){
    //xóa bảng quan hệ xóa nhiều trước, 1 sau
    console.log('cleanDatabase')
    return this.$transaction([
      this.note.deleteMany(),
      this.user.deleteMany(),
    ])
  }
}
