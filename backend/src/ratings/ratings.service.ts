import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRatingDto } from './dto/create-rating.dto.js';
import { UpdateRatingDto } from './dto/update-rating.dto.js';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, storeId: string, dto: CreateRatingDto) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException('Store not found.');
    }

    const existing = await this.prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'You have already submitted a rating for this store. Please modify your existing rating instead.',
      );
    }

    const rating = await this.prisma.rating.create({
      data: {
        userId,
        storeId,
        value: dto.value,
      },
    });

    const stats = await this.getStoreRatingStats(storeId);

    return {
      message: 'Rating submitted successfully.',
      rating,
      averageRating: stats.averageRating,
      totalRatings: stats.totalRatings,
    };
  }

  async update(userId: string, storeId: string, dto: UpdateRatingDto) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException('Store not found.');
    }

    const existing = await this.prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(
        'You have not submitted a rating for this store yet. Please submit a rating first.',
      );
    }

    const rating = await this.prisma.rating.update({
      where: { id: existing.id },
      data: {
        value: dto.value,
      },
    });

    const stats = await this.getStoreRatingStats(storeId);

    return {
      message: 'Rating updated successfully.',
      rating,
      averageRating: stats.averageRating,
      totalRatings: stats.totalRatings,
    };
  }

  private async getStoreRatingStats(storeId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: { storeId },
      select: { value: true },
    });

    const totalRatings = ratings.length;
    const sum = ratings.reduce((acc, r) => acc + r.value, 0);
    const averageRating = totalRatings > 0 ? Number((sum / totalRatings).toFixed(1)) : null;

    return {
      totalRatings,
      averageRating,
    };
  }
}
