import { api } from '@/services/api/axios';
import { MasterCatalog, MasterGroup, MasterSeedResponse } from '@/types/master.types';

export const masterApi = {
  seed: () => api.post<MasterSeedResponse>('/masters/seed'),

  getAll: () => api.get<MasterCatalog>('/masters'),

  getByGroup: (strGroupCode: string) =>
    api.get<MasterGroup>(`/masters/${encodeURIComponent(strGroupCode)}`),
};
