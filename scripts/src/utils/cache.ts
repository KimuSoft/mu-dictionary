import * as path from "node:path";
import { readFile, writeFile } from "fs/promises";

const CACHE_PATH = "cache";

export const saveCache = async (id: string, data: Object) => {
  const cachePath = path.join(CACHE_PATH, `${id}.json`);
  await writeFile(cachePath, JSON.stringify(data, null, 2));
};

export const loadCache = async <T>(id: string): Promise<T | null> => {
  const cachePath = path.join(CACHE_PATH, `${id}.json`);
  try {
    const data = await readFile(cachePath, "utf-8");
    return JSON.parse(data) as T;
  } catch (e) {
    return null;
  }
};
