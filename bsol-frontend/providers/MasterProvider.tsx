'use client';

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useMasterCatalog } from '@/hooks/useMasters';
import { useLayoutStore } from '@/store/useLayoutStore';
import { EMPTY_MASTER_CATALOG, MasterCatalog } from '@/types/master.types';
import { getMasterDefault, isMasterCatalogReady } from '@/lib/master.utils';

interface MasterContextValue {
  objCatalog: MasterCatalog;
  boolReady: boolean;
  boolLoading: boolean;
  boolError: boolean;
}

const MasterContext = createContext<MasterContextValue>({
  objCatalog: EMPTY_MASTER_CATALOG,
  boolReady: false,
  boolLoading: true,
  boolError: false,
});

export function MasterProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError } = useMasterCatalog();
  const applyMasterDefaults = useLayoutStore((state) => state.applyMasterDefaults);
  const objCatalog = data ?? EMPTY_MASTER_CATALOG;
  const boolReady = isMasterCatalogReady(objCatalog);

  useEffect(() => {
    if (!boolReady) {
      return;
    }

    applyMasterDefaults(
      getMasterDefault(objCatalog, 'CITY'),
      getMasterDefault(objCatalog, 'TIME'),
    );
  }, [applyMasterDefaults, boolReady, objCatalog]);

  const objValue = useMemo<MasterContextValue>(
    () => ({
      objCatalog,
      boolReady,
      boolLoading: isLoading,
      boolError: isError,
    }),
    [objCatalog, boolReady, isError, isLoading],
  );

  return <MasterContext.Provider value={objValue}>{children}</MasterContext.Provider>;
}

export const useMasters = () => useContext(MasterContext);
