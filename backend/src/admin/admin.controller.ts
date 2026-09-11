import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AdminService } from './admin.service.js';
import { QueryUsersDto } from './dto/query-users.dto.js';
import { CreateAdminUserDto } from './dto/create-admin-user.dto.js';
import { QueryAdminStoresDto } from './dto/query-admin-stores.dto.js';
import { CreateStoreDto } from './dto/create-store.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  async getUsers(@Query() query: QueryUsersDto) {
    return this.adminService.getUsers(query);
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateAdminUserDto) {
    return this.adminService.createUser(dto);
  }

  @Get('stores')
  async getStores(@Query() query: QueryAdminStoresDto) {
    return this.adminService.getStores(query);
  }

  @Post('stores')
  @HttpCode(HttpStatus.CREATED)
  async createStore(@Body() dto: CreateStoreDto) {
    return this.adminService.createStore(dto);
  }
}
