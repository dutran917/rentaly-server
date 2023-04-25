import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as Tags from '../../utils/Tags.json';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    const count1 = await this.roomTag.count();
    const count2 = await this.apartmentTag.count();
    if (count1 === 0 && count2 === 0) {
      await this.apartmentTag.createMany({
        data: Tags.apartment,
      });
      await this.roomTag.createMany({
        data: Tags.room,
      });
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
