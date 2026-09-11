import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { QueryUsersDto } from './dto/query-users.dto.js';
import { CreateAdminUserDto } from './dto/create-admin-user.dto.js';
import { QueryAdminStoresDto } from './dto/query-admin-stores.dto.js';
import { CreateStoreDto } from './dto/create-store.dto.js';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.store.count(),
      this.prisma.rating.count(),
    ]);

    return {
      totalUsers,
      totalStores,
      totalRatings,
    };
  }

  async getUsers(query: QueryUsersDto) {
    const {
      page = 1,
      limit = 10,
      search,
      name,
      email,
      address,
      role,
      sortBy = 'name',
      sortOrder = 'asc',
    } = query;

    const where: Prisma.UserWhereInput = {};

    if (search && search.trim() !== '') {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { email: { contains: search.trim(), mode: 'insensitive' } },
        { address: { contains: search.trim(), mode: 'insensitive' } },
      ];
    } else {
      if (name && name.trim() !== '') {
        where.name = { contains: name.trim(), mode: 'insensitive' };
      }
      if (email && email.trim() !== '') {
        where.email = { contains: email.trim(), mode: 'insensitive' };
      }
      if (address && address.trim() !== '') {
        where.address = { contains: address.trim(), mode: 'insensitive' };
      }
    }

    if (role) {
      where.role = role;
    }

    const allowedSorts = ['name', 'email', 'address', 'role', 'createdAt'];
    const validSortBy = allowedSorts.includes(sortBy) ? sortBy : 'name';

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [validSortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          role: true,
          createdAt: true,
          ownedStores: {
            select: {
              id: true,
              name: true,
              ratings: {
                select: {
                  value: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const items = users.map((u) => {
      let storeRatingInfo: { storeName: string; averageRating: number | null } | null = null;
      if (u.role === Role.STORE_OWNER && u.ownedStores.length > 0) {
        const store = u.ownedStores[0];
        const count = store.ratings.length;
        const avg = count > 0
          ? Number((store.ratings.reduce((acc, r) => acc + r.value, 0) / count).toFixed(1))
          : null;
        storeRatingInfo = {
          storeName: store.name,
          averageRating: avg,
        };
      }

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        address: u.address,
        role: u.role,
        createdAt: u.createdAt,
        storeRatingInfo,
      };
    });

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        ownedStores: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            ratings: {
              select: {
                value: true,
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    let ownerStoresSummary = undefined;
    if (user.role === Role.STORE_OWNER) {
      ownerStoresSummary = user.ownedStores.map((s) => {
        const count = s.ratings.length;
        const avg = count > 0
          ? Number((s.ratings.reduce((acc, r) => acc + r.value, 0) / count).toFixed(1))
          : null;
        return {
          id: s.id,
          name: s.name,
          email: s.email,
          address: s.address,
          totalRatings: count,
          averageRating: avg,
        };
      });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      stores: ownerStoresSummary,
    };
  }

  async createUser(dto: CreateAdminUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('A user with this email address already exists.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        address: dto.address,
        passwordHash,
        role: dto.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  async getStores(query: QueryAdminStoresDto) {
    const {
      page = 1,
      limit = 10,
      search,
      name,
      email,
      address,
      sortBy = 'name',
      sortOrder = 'asc',
    } = query;

    const where: Prisma.StoreWhereInput = {};

    if (search && search.trim() !== '') {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { email: { contains: search.trim(), mode: 'insensitive' } },
        { address: { contains: search.trim(), mode: 'insensitive' } },
      ];
    } else {
      if (name && name.trim() !== '') {
        where.name = { contains: name.trim(), mode: 'insensitive' };
      }
      if (email && email.trim() !== '') {
        where.email = { contains: email.trim(), mode: 'insensitive' };
      }
      if (address && address.trim() !== '') {
        where.address = { contains: address.trim(), mode: 'insensitive' };
      }
    }

    const allowedSorts = ['name', 'email', 'address', 'createdAt'];
    const validSortBy = allowedSorts.includes(sortBy) ? sortBy : 'name';

    const [total, stores] = await Promise.all([
      this.prisma.store.count({ where }),
      this.prisma.store.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [validSortBy]: sortOrder },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          ratings: {
            select: {
              value: true,
            },
          },
        },
      }),
    ]);

    const items = stores.map((s) => {
      const count = s.ratings.length;
      const sum = s.ratings.reduce((acc, r) => acc + r.value, 0);
      const averageRating = count > 0 ? Number((sum / count).toFixed(1)) : null;

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        averageRating,
        totalRatings: count,
        owner: s.owner,
        createdAt: s.createdAt,
      };
    });

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async createStore(dto: CreateStoreDto) {
    const existing = await this.prisma.store.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('A store with this email already exists.');
    }

    if (dto.ownerId) {
      const owner = await this.prisma.user.findUnique({
        where: { id: dto.ownerId },
      });

      if (!owner) {
        throw new NotFoundException('Specified store owner does not exist.');
      }

      if (owner.role !== Role.STORE_OWNER) {
        throw new BadRequestException('Specified user does not have the STORE_OWNER role.');
      }
    }

    const store = await this.prisma.store.create({
      data: {
        name: dto.name,
        email: dto.email,
        address: dto.address,
        ownerId: dto.ownerId || null,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return store;
  }
}
