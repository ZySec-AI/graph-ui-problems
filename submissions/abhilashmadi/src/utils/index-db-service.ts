import { ZodSchema } from 'zod';
import StorageKeys from '@utils/storage-keys';
import { graphDataDbDocSchema, type GraphDataDbDoc } from '@schema/graph-data-doc-schema';
import type { GraphData } from "@/schema/input-json-schema";

export default class IndexedDbService<T extends { id: number | string }> {
  private dbName: string;
  private storeName: string;
  private version: number;
  private schema: ZodSchema<T>;

  constructor(options: {
    dbName: string;
    storeName: string;
    version?: number;
    schema: ZodSchema<T>;
  }) {
    this.dbName = options.dbName;
    this.storeName = options.storeName;
    this.version = options.version || 1;
    this.schema = options.schema;
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async save(doc: T): Promise<void> {
    const validated = this.schema.parse(doc);
    const db = await this.openDB();
    const tx = db.transaction(this.storeName, 'readwrite');
    tx.objectStore(this.storeName).put(validated);

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getById(id: string | number): Promise<T | undefined> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const request = tx.objectStore(this.storeName).get(id);

      request.onsuccess = () => resolve(request.result as T | undefined);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(): Promise<T[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const request = tx.objectStore(this.storeName).getAll();

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(id: number | string): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction(this.storeName, 'readwrite');
    tx.objectStore(this.storeName).delete(id);

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async findByField<K extends keyof T>(field: K, value: T[K]): Promise<T[]> {
    const all = await this.getAll();
    return all.filter(doc => doc[field] === value);
  }

  async getAllProjections<K extends keyof T>(fields: K[]): Promise<Pick<T, K>[]> {
    const allDocs = await this.getAll();

    return allDocs.map(doc => {
      const projection: Partial<T> = {};
      fields.forEach(field => {
        projection[field] = doc[field];
      });
      return projection as Pick<T, K>;
    });
  }

  async getProjection<K extends keyof T>(id: string | number, fields: K[]): Promise<Pick<T, K> | undefined> {
    const doc = await this.getById(id);
    if (!doc) return undefined;

    const projection: Partial<T> = {};
    fields.forEach(field => {
      projection[field] = doc[field];
    });

    return projection as Pick<T, K>;
  }
}

export const graphStorageInstance = new IndexedDbService<GraphDataDbDoc>({
  dbName: StorageKeys.DB_NAME,
  schema: graphDataDbDocSchema,
  storeName: StorageKeys.GRAPHS,
  version: 1,
})

export async function seedInitialGraphsIfNeeded(): Promise<void> {
  const alreadySeeded = localStorage.getItem(StorageKeys.SEED_FLAG_KEY);
  if (alreadySeeded) return;

  try {
    const graphModules = await Promise.all([
      import('@/resources/sample-1.json'),
      import('@/resources/sample-2.json'),
      import('@/resources/sample-3.json'),
      import('@/resources/sample-4.json'),
      import('@/resources/sample-5.json'),
      import('@/resources/sample-6.json'),
      import('@/resources/sample-7.json'),
      import('@/resources/sample-8.json'),
    ]);

    const graphDocs = graphModules.map(m => m.default);

    let count = 1;
    for await (const graph of graphDocs) {
      graphStorageInstance.save({
        id: Date.now(),
        title: graph.meta?.title || `graph-${count}`,
        data: graph as GraphData
      });
      count++;
    }

    localStorage.setItem(StorageKeys.SEED_FLAG_KEY, "true");
  } catch (error) {
    console.error("Failed to dynamically seed graph data:", error);
  }
}