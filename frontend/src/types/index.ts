export type Role = 'ADMIN' | 'USER' | 'STORE_OWNER';

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
  storeRatingInfo?: {
    storeName: string;
    averageRating: number | null;
  } | null;
  stores?: {
    id: string;
    name: string;
    email: string;
    address: string;
    totalRatings: number;
    averageRating: number | null;
  }[];
}

export interface Store {
  id: string;
  name: string;
  email?: string;
  address: string;
  averageRating: number | null;
  totalRatings: number;
  myRating: number | null;
  createdAt?: string;
  owner?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface Rating {
  id: string;
  value: number;
  userId: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RaterInfo {
  id: string;
  name: string;
  email: string;
  rating: number;
  createdAt: string;
}

export interface OwnerDashboardData {
  hasStore: boolean;
  message?: string;
  store?: {
    id: string;
    name: string;
    email: string;
    address: string;
  };
  averageRating: number | null;
  totalRatings: number;
  raters: RaterInfo[];
  allStores?: {
    id: string;
    name: string;
    email: string;
    address: string;
    totalRatings: number;
    averageRating: number | null;
  }[];
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
}
