import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service.js';
import { QueryStoresDto } from './dto/query-stores.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  async findAll(
    @Query() query: QueryStoresDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.storesService.findAll(query, user.userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.storesService.findOne(id, user.userId);
  }
}
