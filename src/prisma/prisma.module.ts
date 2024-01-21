import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ConfigService, PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
