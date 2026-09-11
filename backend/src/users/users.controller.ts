import {
  Controller,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UpdatePasswordDto } from './dto/update-password.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(user.userId, dto);
  }
}
