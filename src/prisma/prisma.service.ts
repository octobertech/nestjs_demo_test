import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Optional: Log connection status or perform actions on connect
    await this.$connect();
    console.log('Prisma Client Connected'); // Example log
  }

  async onModuleDestroy() {
    // Ensure graceful disconnection on application shutdown
    await this.$disconnect();
    console.log('Prisma Client Disconnected'); // Example log
  }
}