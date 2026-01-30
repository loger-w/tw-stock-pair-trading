import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { StockGroup } from '@/types';
import { DB_CONFIG } from '@/lib/constants';

interface PairsTradingDB extends DBSchema {
  groups: {
    key: string;
    value: StockGroup;
    indexes: { 'by-created': number };
  };
}

let dbPromise: Promise<IDBPDatabase<PairsTradingDB>> | null = null;

/**
 * Get or initialize the database connection
 */
export const getDB = (): Promise<IDBPDatabase<PairsTradingDB>> => {
  if (!dbPromise) {
    dbPromise = openDB<PairsTradingDB>(DB_CONFIG.name, DB_CONFIG.version, {
      upgrade(db) {
        // Create groups store with index on createdAt
        if (!db.objectStoreNames.contains('groups')) {
          const groupStore = db.createObjectStore('groups', { keyPath: 'id' });
          groupStore.createIndex('by-created', 'createdAt');
        }
      },
    });
  }
  return dbPromise;
};

/**
 * Get all stock groups, sorted by creation time
 */
export const getAllGroups = async (): Promise<StockGroup[]> => {
  const db = await getDB();
  return db.getAllFromIndex('groups', 'by-created');
};

/**
 * Get a single group by ID
 */
export const getGroup = async (id: string): Promise<StockGroup | undefined> => {
  const db = await getDB();
  return db.get('groups', id);
};

/**
 * Create a new group
 */
export const createGroup = async (group: StockGroup): Promise<void> => {
  const db = await getDB();
  await db.add('groups', group);
};

/**
 * Update an existing group
 */
export const updateGroup = async (group: StockGroup): Promise<void> => {
  const db = await getDB();
  await db.put('groups', group);
};

/**
 * Delete a group by ID
 */
export const deleteGroup = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete('groups', id);
};

/**
 * Add a stock to a group
 */
export const addStockToGroup = async (
  groupId: string,
  stockId: string
): Promise<StockGroup | null> => {
  const db = await getDB();
  const group = await db.get('groups', groupId);

  if (!group) return null;

  // Check if stock already exists
  if (group.stockIds.includes(stockId)) {
    return group;
  }

  // Check max limit
  if (group.stockIds.length >= 5) {
    return group;
  }

  const updatedGroup: StockGroup = {
    ...group,
    stockIds: [...group.stockIds, stockId],
    updatedAt: Date.now(),
  };

  await db.put('groups', updatedGroup);
  return updatedGroup;
};

/**
 * Remove a stock from a group
 */
export const removeStockFromGroup = async (
  groupId: string,
  stockId: string
): Promise<StockGroup | null> => {
  const db = await getDB();
  const group = await db.get('groups', groupId);

  if (!group) return null;

  const updatedGroup: StockGroup = {
    ...group,
    stockIds: group.stockIds.filter((id) => id !== stockId),
    updatedAt: Date.now(),
  };

  await db.put('groups', updatedGroup);
  return updatedGroup;
};

/**
 * Generate a unique ID for new groups
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};
