import { useCallback, useEffect, useMemo, useState } from 'react';
import type { StockCatalog, StockInfo } from '@/types';

type StockListItem = StockInfo & { searchText: string };

// Module-level cache — loaded once, shared across all hook instances
let catalogCache: StockCatalog | null = null;
let listCache: StockListItem[] | null = null;

const loadStockData = async (): Promise<void> => {
  if (catalogCache) return;
  const module = await import("../data/TWSE_stocks.json");
  catalogCache = module.default as StockCatalog;
  listCache = Object.values(catalogCache).map((stock) => ({
    ...stock,
    searchText: `${stock.代號} ${stock.名稱}`.toLowerCase(),
  }));
};

/**
 * Hook for stock search and autocomplete
 */
export const useStockSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [catalog, setCatalog] = useState<StockCatalog | null>(catalogCache);
  const [stockList, setStockList] = useState<StockListItem[]>(listCache ?? []);

  useEffect(() => {
    if (catalogCache) return;
    loadStockData().then(() => {
      setCatalog(catalogCache);
      setStockList(listCache!);
    });
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();

    const exactMatch = stockList.filter(
      (stock) => stock.代號.toLowerCase() === query,
    );

    if (exactMatch.length > 0) {
      return exactMatch;
    }

    return stockList
      .filter((stock) => stock.searchText.includes(query))
      .slice(0, 10);
  }, [searchQuery, stockList]);

  const isValidStockCode = useCallback(
    (code: string): boolean => {
      return catalog ? code in catalog : false;
    },
    [catalog],
  );

  const getStockInfo = useCallback(
    (code: string): StockInfo | null => {
      return catalog?.[code] || null;
    },
    [catalog],
  );

  const getStockName = useCallback(
    (code: string): string => {
      return catalog?.[code]?.名稱 || code;
    },
    [catalog],
  );

  const formatStockDisplay = useCallback(
    (code: string): string => {
      const info = catalog?.[code];
      if (info) {
        return `${info.代號} ${info.名稱}`;
      }
      return code;
    },
    [catalog],
  );

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isValidStockCode,
    getStockInfo,
    getStockName,
    formatStockDisplay,
    stockCatalog: catalog ?? {},
  };
};
