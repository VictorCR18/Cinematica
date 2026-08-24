import { useSyncExternalStore } from 'react';
import { getNetworkActivityCount, subscribeNetworkActivity } from '../lib/api-client';

export const useNetworkActivity = () =>
  useSyncExternalStore(subscribeNetworkActivity, getNetworkActivityCount, getNetworkActivityCount);
