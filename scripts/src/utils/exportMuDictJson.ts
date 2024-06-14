import { writeFile } from "fs/promises";

export const exportMuDictJson = async (refId: string, data: Object) => {
  const today = new Date();
  // array json 파일로 저장
  await writeFile(
    `./data/${refId.toUpperCase()}_${today.getFullYear()}-${today
      .getMonth()
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}-${today
      .getHours()
      .toString()
      .padStart(2, "0")}-${today
      .getMinutes()
      .toString()
      .padStart(2, "0")}.json`,

    JSON.stringify(data, null, 2),
  );
};
