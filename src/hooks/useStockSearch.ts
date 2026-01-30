import { useCallback, useMemo, useState } from "react";
import stockData from "../data/TWSE_stocks.json";
import type { StockCatalog, StockInfo } from "@/types";

// Type assertion for the imported JSON
const STOCK_CATALOG = stockData as StockCatalog;

// Create a searchable array from the catalog
const STOCK_LIST: Array<StockInfo & { searchText: string }> = Object.values(
  STOCK_CATALOG,
).map((stock) => ({
  ...stock,
  searchText: `${stock.代號} ${stock.名稱}`.toLowerCase(),
}));

/**
 * Hook for stock search and autocomplete
 */
export const useStockSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Search results filtered by query
   */
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();

    // Exact code match first
    const exactMatch = STOCK_LIST.filter(
      (stock) => stock.代號.toLowerCase() === query,
    );

    if (exactMatch.length > 0) {
      return exactMatch;
    }

    // Partial match (limit to 10 results)
    return STOCK_LIST.filter((stock) => stock.searchText.includes(query)).slice(
      0,
      10,
    );
  }, [searchQuery]);

  /**
   * Check if a stock code is valid
   */
  const isValidStockCode = useCallback((code: string): boolean => {
    return code in STOCK_CATALOG;
  }, []);

  /**
   * Get stock info by code
   */
  const getStockInfo = useCallback((code: string): StockInfo | null => {
    return STOCK_CATALOG[code] || null;
  }, []);

  /**
   * Get stock name by code
   */
  const getStockName = useCallback((code: string): string => {
    return STOCK_CATALOG[code]?.名稱 || code;
  }, []);

  /**
   * Format stock display: "代號 名稱"
   */
  const formatStockDisplay = useCallback((code: string): string => {
    const info = STOCK_CATALOG[code];
    if (info) {
      return `${info.代號} ${info.名稱}`;
    }
    return code;
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isValidStockCode,
    getStockInfo,
    getStockName,
    formatStockDisplay,
    stockCatalog: STOCK_CATALOG,
  };
};

/**
 * Get the full stock catalog
 */
export const getStockCatalog = (): StockCatalog => STOCK_CATALOG;
