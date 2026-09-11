import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { StoresModule } from './stores/stores.module.js';
import { RatingsModule } from './ratings/ratings.module.js';
import { AdminModule } from './admin/admin.module.js';
import { OwnerModule } from './owner/owner.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    StoresModule,
    RatingsModule,
    AdminModule,
    OwnerModule,
  ],
})
export class AppModule {}
