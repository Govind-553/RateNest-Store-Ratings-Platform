import { Controller, Get, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { OwnerService } from './owner.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';

@Controller('owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.STORE_OWNER)
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Get('dashboard')
  async getDashboard(@CurrentUser() user: CurrentUserPayload) {
    return this.ownerService.getDashboard(user.userId);
  }
}
