import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service'; // Path relative to src/prisma.module.ts

@Global() // Makes PrismaService available globally without needing to import PrismaModule everywhere
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export PrismaService so it can be injected
})
export class PrismaModule {}