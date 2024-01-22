import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [ConfigService, PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
