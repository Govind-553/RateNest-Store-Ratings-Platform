import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { QueryStoresDto } from './dto/query-stores.dto.js';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryStoresDto, currentUserId?: string) {
    const {
      page = 1,
      limit = 10,
      search,
      name,
      address,
      sortBy = 'name',
      sortOrder = 'asc',
    } = query;

    const where: Prisma.StoreWhereInput = {};

    if (search && search.trim() !== '') {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { address: { contains: search.trim(), mode: 'insensitive' } },
      ];
    } else {
      if (name && name.trim() !== '') {
        where.name = { contains: name.trim(), mode: 'insensitive' };
      }
      if (address && address.trim() !== '') {
        where.address = { contains: address.trim(), mode: 'insensitive' };
      }
    }

    const allowedSorts = ['name', 'address', 'createdAt'];
    const validSortBy = allowedSorts.includes(sortBy) ? sortBy : 'name';

    const [total, stores] = await Promise.all([
      this.prisma.store.count({ where }),
      this.prisma.store.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [validSortBy]: sortOrder },
        include: {
          ratings: {
            select: {
              value: true,
              userId: true,
            },
          },
        },
      }),
    ]);

    const items = stores.map((store) => {
      const count = store.ratings.length;
      const sum = store.ratings.reduce((acc, r) => acc + r.value, 0);
      const averageRating = count > 0 ? Number((sum / count).toFixed(1)) : null;

      const myRatingRecord = currentUserId
        ? store.ratings.find((r) => r.userId === currentUserId)
        : null;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating,
        totalRatings: count,
        myRating: myRatingRecord ? myRatingRecord.value : null,
        createdAt: store.createdAt,
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

  async findOne(id: string, currentUserId?: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: {
        ratings: {
          select: {
            value: true,
            userId: true,
          },
        },
      },
    });

    if (!store) {
      return null;
    }

    const count = store.ratings.length;
    const sum = store.ratings.reduce((acc, r) => acc + r.value, 0);
    const averageRating = count > 0 ? Number((sum / count).toFixed(1)) : null;
    const myRatingRecord = currentUserId
      ? store.ratings.find((r) => r.userId === currentUserId)
      : null;

    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating,
      totalRatings: count,
      myRating: myRatingRecord ? myRatingRecord.value : null,
      createdAt: store.createdAt,
    };
  }
}
