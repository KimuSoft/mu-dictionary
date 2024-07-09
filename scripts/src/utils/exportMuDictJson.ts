import { writeFile } from "fs/promises";
import { uniqBy } from "lodash";
import { MuDictDump } from "../types";
import { PartOfSpeech } from "mudict-api-types";

export const exportMuDictJson = async (refId: string, data: MuDictDump) => {
  // default에 referenceId가 있는지 체크
  if (!data.default.referenceId) {
    throw new Error("default에 referenceId가 없습니다. (exportMuDictJson)");
  }

  data.default = {
    pos: PartOfSpeech.Noun,
    definition: "",
    ...data.default,
  };

  // ID 중복이 있는지 체크
  const itemsWithId = data.items.filter((item) => item.sourceId);

  if (itemsWithId.length !== data.items.length) {
    throw new Error(
      `${data.items.length - itemsWithId.length}개의 아이템이 ID를 가지고 있지 않습니다. (exportMuDictJson)`,
    );
  }

  // referenceId가 /[A-z0-9-_]/를 제외한 문자가 있는지 체크
  const invalidIdItems = data.items.filter(
    (item) => !/^[A-z0-9-_]+$/.test(item.sourceId!),
  );

  // invalidIdItems가 있으면 경고하고 종료
  if (invalidIdItems.length) {
    console.warn(invalidIdItems.map((item) => item.sourceId).join(", "));
    throw new Error(
      `${invalidIdItems.length}개의 아이템이 올바르지 않은 ID를 가지고 있습니다. (exportMuDictJson)`,
    );
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
    `./data/${refId.toUpperCase()}_${today.getFullYear()}-${(
      today.getMonth() + 1
    )
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
  console.info(`JSON file exported. (${data.items.length})`);
};
