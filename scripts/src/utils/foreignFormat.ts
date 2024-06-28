import { readFile, writeFile } from "fs/promises";
import { sortBy, uniqBy } from "lodash";

export interface ForeignReplaceData {
  key: string;
  replace: string;
  priority?: number;
}

const format = async () => {
  // 루트에서 foreign_replace.json 파일을 읽어옴
  const buffer = await readFile("foreign_replace.json");
  let json = JSON.parse(buffer.toString()) as ForeignReplaceData[];

  // 백업 미리 저장
  await writeFile("foreign_replace_backup.json", JSON.stringify(json, null, 2));

  json = uniqBy(json, (v) => `${v.key}@@@${v.replace}`);
  json = sortBy(json, (v) => v.key);

  // foreign_replace.json 파일에 저장
  await writeFile("foreign_replace.json", JSON.stringify(json));
  console.info("foreign_replace.json formatted");
};

format().then();
