import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { type FsConfig } from "@/fs/fs.config.mts";

export const buildFsRead =
  (config: FsConfig) =>
  async (tableName: string): Promise<string> => {
    const fullPath = path.join(process.cwd(), config.dbPath, tableName);
    const tableExist = await fs.access(fullPath).then(
      () => true,
      () => false
    );
    if (tableExist === false) {
      await fs.writeFile(fullPath, "");
    }
    return await fs.readFile(fullPath, "utf8");
  };
