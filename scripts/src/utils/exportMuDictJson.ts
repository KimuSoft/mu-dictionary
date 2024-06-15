import { writeFile } from "fs/promises";
import { uniqBy } from "lodash";
import { MuDict } from "../types";

export const exportMuDictJson = async (refId: string, data: MuDict) => {
  // ID 중복이 있는지 체크
  const itemsWithId = data.items.filter((item) => item.sourceId);

  // ID가 없는 아이템 개수만큼 경고
  if (itemsWithId.length !== data.items.length) {
    console.error(
      `${data.items.length - itemsWithId.length}개의 아이템이 ID를 가지고 있지 않습니다. (exportMuDictJson)`,
    );
    return;
  }

  if (uniqBy(itemsWithId, "sourceId").length !== itemsWithId.length) {
    // 무엇이 중복되었는지 계산
    const duplicated = itemsWithId.reduce(
      (acc, cur) => {
        if (acc[cur.sourceId!]) {
          acc[cur.sourceId!]++;
        } else {
          acc[cur.sourceId!] = 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    // 무엇이 몇 번 중복되었는지 출력 (2 이상인 key)
    console.error(
      Object.entries(duplicated)
        .filter(([, value]) => value > 1)
        .map(([key, value]) => `${key}(${value})`),
    );

    throw new Error("ID 중복이 있습니다. (exportMuDictJson)");
  }

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
