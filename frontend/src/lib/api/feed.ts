import { api } from '../api-client';
import type { ActivityItem, PaginatedResponse } from '../../types';

export const getFeed = (page = 1) =>
  api.get<PaginatedResponse<ActivityItem>>('/feed', { params: { page } }).then((r) => r.data);
