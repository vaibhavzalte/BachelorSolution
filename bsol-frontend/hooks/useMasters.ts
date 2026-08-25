import { useQuery } from '@tanstack/react-query';
import { masterApi } from '@/services/master/master.api';
import { EMPTY_MASTER_CATALOG, MasterCatalog } from '@/types/master.types';

export const masterQueryKeys = {
  all: ['masters'] as const,
  catalog: () => [...masterQueryKeys.all, 'catalog'] as const,
};

const loadMasterCatalog = async (): Promise<MasterCatalog> => {
  await masterApi.seed();
  const objResponse = await masterApi.getAll();
  return objResponse.data ?? EMPTY_MASTER_CATALOG;
};

export const useMasterCatalog = () => {
  return useQuery({
    queryKey: masterQueryKeys.catalog(),
    queryFn: loadMasterCatalog,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });
};
