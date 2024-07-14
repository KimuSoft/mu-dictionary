import { readdir, readFile } from "fs/promises";
import Knex from "knex";
import "dotenv";
import { MuDictDump, MudictDumpItem } from "../types";
import { Logger } from "tslog";

const whitelist = process.argv.slice(2);

const logger = new Logger({ name: "MUDICT_SYNC" });

const knex = Knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

// ./data 안에 있는 json 파일을 모두 로드함
const loadJsonFiles = async () => {
  const files = await readdir("./data");
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  return Promise.all(
    jsonFiles.map(async (file) => {
      const json = await readFile(`./data/${file}`, "utf8");
      const jsonData = JSON.parse(json) as MuDictDump;

      // whitelist가 비어있지 않고 whitelist에 해당되지 않는 경우 데이터 제외
      if (
        whitelist.length &&
        !whitelist.includes(jsonData.default.referenceId)
      ) {
        return null;
      }

      return jsonData as MuDictDump;
    }),
  );
};

const run = async () => {
  const data = await loadJsonFiles();

  // 데이터베이스에 데이터 삽입
  for (const dict of data) {
    if (!dict) continue;

    logger.info(`Start to sync ${dict.default.referenceId}...`);

    // word 테이블에서 기존 동일 referenceId 데이터 삭제
    logger.info(`Deleting ${dict.default.referenceId}...`);
    await knex("word").where("referenceId", dict.default.referenceId).delete();

    // word 테이블에 데이터 삽입 전 default 값 적용
    const items: MudictDumpItem[] = dict.items.map((item) => ({
      definition: "",
      ...dict.default,
      ...item,
    }));

    logger.info(
      `Inserting ${dict.default.referenceId}... (SIZE: ${items.length})`,
    );

    // 데이터 삽입
    await knex.batchInsert("word", items, 1000);
  }

  logger.info("Done.");
  process.exit(0);
};

void run();
