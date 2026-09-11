import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RatingsService } from './ratings.service.js';
import { CreateRatingDto } from './dto/create-rating.dto.js';
import { UpdateRatingDto } from './dto/update-rating.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';

@Controller('stores/:storeId/ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('storeId') storeId: string,
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateRatingDto,
  ) {
    return this.ratingsService.create(user.userId, storeId, dto);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('storeId') storeId: string,
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateRatingDto,
  ) {
    return this.ratingsService.update(user.userId, storeId, dto);
  }
}
