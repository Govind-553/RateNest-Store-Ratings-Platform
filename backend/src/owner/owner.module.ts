import { Module } from '@nestjs/common';
import { OwnerService } from './owner.service.js';
import { OwnerController } from './owner.controller.js';

@Module({
  controllers: [OwnerController],
  providers: [OwnerService],
  exports: [OwnerService],
})
export class OwnerModule {}
