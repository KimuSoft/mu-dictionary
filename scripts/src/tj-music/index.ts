import { readFile, writeFile } from "fs/promises";
import { wordConvert } from "../utils/wordConvert";
import { MuDict, MuDictItem, PartOfSpeech } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import axios from "axios";
import * as cheerio from "cheerio";
import { TJSong } from "./types";
import { josa } from "es-hangul";

// bun <Command> <Path>
const useCache = !!process.argv[2];
const EXISTING_PATH = "./src/tj-music/cache.json";
const REFERENCE_ID = "tj-music";

const REQUEST_DELAY = 500;

const result: MuDict = {
  items: [],
  default: {
    definition: "",
    referenceId: REFERENCE_ID,
    tags: ["음악"],
    pos: PartOfSpeech.Noun,
  },
};

const enum SearchType {
  Title,
  Singer,
  Lyricist,
  Composer,
  SongId = 16,
}

const SEARCH_URL = "https://www.tjmedia.co.kr/tjsong/song_search_list.asp";

const search = async (keyword: string, searchType: SearchType, page = 1) => {
  const res = await axios.get(SEARCH_URL, {
    params: {
      strType: searchType,
      natType: "",
      strText: keyword,
      strCond: 0,
      strSize05: 100,
      intPage: page,
    },
  });

  if (res.data.includes("검색 결과를 찾을 수 없습니다.")) {
    console.log("검색 결과를 찾을 수 없습니다");
    return [];
  }

  const $ = cheerio.load(res.data);

  const songs: TJSong[] = [];
  $(".board_type1").each((_index, item) => {
    $(item)
      .find("tr")
      .each((index, item) => {
        if (
          !index ||
          $(item).text().includes("검색 결과를 찾을 수 없습니다.")
        ) {
          return;
        }

        songs.push({
          id: parseInt(
            $(item)
              .children(":nth-child(1)")
              .text()
              .replace(/[\n\t]/g, ""),
          ),
          title: $(item)
            .children(":nth-child(2)")
            .text()
            .replace(/[\n\t]/g, ""),
          singer: $(item)
            .children(":nth-child(3)")
            .text()
            .replace(/[\n\t]/g, ""),
          composer: $(item)
            .children(":nth-child(4)")
            .text()
            .replace(/[\n\t]/g, ""),
          lyricist: $(item)
            .children(":nth-child(5)")
            .text()
            .replace(/[\n\t]/g, ""),
        });
      });
  });

  return songs;
};

const save = async (songs: TJSong[]) => {
  console.info("Start Caching...");

  // songs를 id로 sort
  songs.sort((a, b) => a.id - b.id);

  // json 저장
  await writeFile(EXISTING_PATH, JSON.stringify(songs, null, 2), "utf8");
};

const run = async () => {
  let songs: TJSong[] = [];

  if (!useCache) {
    // 0부터 9까지 for
    try {
      for (let i = 0; i <= 6; i++) {
        let page = 1;

        // 100,000 개 기준으로 6까지 검색하면 전체의 99.6%를 검색할 수 있음
        while (true) {
          console.info(`Searching ${i}... (${page} page)`);
          const searchResult = await search(
            i.toString(),
            SearchType.SongId,
            page++,
          );
          if (!searchResult.length) break;
          console.info(`Found ${searchResult.length} songs.`);

          for (const song of searchResult) {
            // 이미 있는 ID는 제외
            if (songs.find((s) => s.id === song.id)) {
              // console.log("Already exists", song.id);
              continue;
            }

            songs.push(song);
          }
          await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY));
        }

        await save(songs);
      }

      // 나머지 0.4% 검색

      // 가장 높은 ID값 구하기
      const maxId = songs.reduce((prev, curr) =>
        prev.id > curr.id ? prev : curr,
      ).id;

      // 0부터 가장 높은 ID값까지 중 없는 ID값 찾기
      for (let i = 0; i <= maxId + 10; i++) {
        if (songs.find((s) => s.id === i)) {
          continue;
        }

        // 500마다 저장
        if (i % 500 === 0) {
          await save(songs);
        }

        console.info(`Searching ${i}...`);
        const searchResult = await search(i.toString(), SearchType.SongId);
        if (!searchResult.length) {
          console.info(`Not found ${i}`);
          continue;
        }
        console.info(`Found ${searchResult.length} songs.`);

        for (const song of searchResult) {
          // 이미 있는 ID는 제외
          if (songs.find((s) => s.id === song.id)) {
            // console.log("Already exists", song.id);
            continue;
          }

          songs.push(song);
        }
        await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY));
      }
    } catch (e) {
      console.error(e);
    } finally {
      await save(songs);
    }
  } else {
    console.info("Loding JSON Cache file...");
    songs = JSON.parse(await readFile(EXISTING_PATH, "utf8")) as TJSong[];
    console.info("JSON file loaded.");
  }

  const personMap = new Map<
    string,
    {
      isSinger: boolean;
      isComposer: boolean;
      isLyricist: boolean;
      songs: string[];
    }
  >();

  const failed: string[] = [];

  for (const song of songs) {
    const people = [
      ...song.singer.replace(/\(.*,.*\)/g, "").split(","),
      ...song.composer.replace(/\(.*,.*\)/g, "").split(","),
      ...song.lyricist.replace(/\(.*,.*\)/g, "").split(","),
    ].filter((v) => v);

    // 인물 처리
    for (const person of people) {
      const name =
        wordConvert(
          person
            .replace(/[(\[][^()]+[)\]]/g, "")
            .replace(/[(\[][^()]+[)\]]/g, ""),
        ) ||
        wordConvert(
          person.match(/[(\[]([^()]+)[)\]]/)?.[0]?.replace(/[()]/g, "") || "",
        );

      if (name?.origin.includes("(") || name?.origin.includes("["))
        console.warn(song.singer, song.lyricist, song.composer, person, name);

      if (!name) {
        failed.push(person);
        continue;
      }

      if (!personMap.has(name.origin)) {
        personMap.set(name.origin, {
          isSinger: false,
          isComposer: false,
          isLyricist: false,
          songs: [],
        });
      }

      const data = personMap.get(name.origin)!;
      data.songs.push(song.title);
      data.isSinger ||= song.singer.includes(person);
      data.isComposer ||= song.composer.includes(person);
      data.isLyricist ||= song.lyricist.includes(person);
    }

    // 곡 처리
    let word =
      wordConvert(song.title.replace(/[(\[].+[)\]]/g, "")) ||
      wordConvert(
        song.title.match(/[(\[]([^()]+)[)\]]/)?.[0]?.replace(/[()]/g, "") || "",
      );

    // 만약 word가 없다면 다음으로 넘어감
    if (!word) {
      failed.push(song.title);
      continue;
    }

    // 단어 추가
    result.items.push({
      sourceId: "TJ_MUSIC_" + song.id,
      name: word.name,
      origin: word.origin,
      simplifiedName: word.simplifiedName,
      definition: `${josa(song.singer, "이/가")} 부른 ${song.composer} 작곡, ${song.lyricist} 작사의 노래. TJ 노래방에 ${song.id}번으로 수록되어 있다.`,
      tags: ["음악"],
    });
  }

  for (const [person, data] of personMap) {
    const name = wordConvert(person);
    if (!name) {
      continue;
    }

    const definition = `${[
      data.isSinger ? "가수" : "",
      data.isComposer ? "작곡가" : "",
      data.isLyricist ? "작사가" : "",
    ]
      .filter((v) => v)
      .join(", ")}로 활동하는 인물. 대표곡으로는 ${data.songs
      .slice(0, 3)
      .map((v) => `≪${v}≫`)
      .join(", ")} 등이 있다.`;

    result.items.push({
      sourceId: "TJ_PERSON_" + name.origin,
      name: name.name,
      origin: name.origin,
      simplifiedName: name.simplifiedName,
      definition,
      tags: ["인명"],
    });
  }

  // 실패 단어 저장
  await writeFile(
    `./${REFERENCE_ID.toUpperCase()}_failed.json`,
    JSON.stringify(failed, null, 2),
  );

  // 종료 단계
  await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
