import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { type FsConfig } from "@/fs/fs.config.mts";

export const buildFsSave =
  (config: FsConfig) =>
  async (tableName: string, data: string): Promise<void> => {
    const fullPath = path.join(process.cwd(), config.dbPath, tableName);
    await fs.writeFile(fullPath, data);
  };
