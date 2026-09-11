import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class OwnerService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(ownerId: string) {
    const stores = await this.prisma.store.findMany({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!stores || stores.length === 0) {
      return {
        hasStore: false,
        message: 'No store is currently assigned to this store owner account.',
        stores: [],
        averageRating: null,
        totalRatings: 0,
        raters: [],
      };
    }

    // If single or multiple, summarize primary and all stores
    const primaryStore = stores[0];
    const totalRatings = primaryStore.ratings.length;
    const sum = primaryStore.ratings.reduce((acc, r) => acc + r.value, 0);
    const averageRating = totalRatings > 0 ? Number((sum / totalRatings).toFixed(1)) : null;

    const raters = primaryStore.ratings.map((r) => ({
      id: r.id,
      name: r.user.name,
      email: r.user.email,
      rating: r.value,
      createdAt: r.createdAt,
    }));

    const allStoresSummary = stores.map((s) => {
      const sCount = s.ratings.length;
      const sSum = s.ratings.reduce((acc, r) => acc + r.value, 0);
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        totalRatings: sCount,
        averageRating: sCount > 0 ? Number((sSum / sCount).toFixed(1)) : null,
      };
    });

    return {
      hasStore: true,
      store: {
        id: primaryStore.id,
        name: primaryStore.name,
        email: primaryStore.email,
        address: primaryStore.address,
      },
      averageRating,
      totalRatings,
      raters,
      allStores: allStoresSummary,
    };
  }
}
