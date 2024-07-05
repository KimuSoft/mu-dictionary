import { readFile, writeFile } from "fs/promises";
import { wordConvert } from "../utils/wordConvert";
import { MuDict, MuDictItem, PartOfSpeech } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import axios from "axios";

// bun <Command> <Path>
const useCache = !!process.argv[2];
const REFERENCE_ID = "pokemon";

const result: MuDict = {
  items: [],
  default: {
    definition: "~에 등장하는 단어",
    referenceId: REFERENCE_ID,
    tags: ["포켓몬스터"],
    pos: PartOfSpeech.Noun,
  },
};

const POKEDEX_URL = "https://pokemonkorea.co.kr/ajax/pokedex";

const run = async () => {
  let page = 2;

  const pokemons: any[] = [];
  while (true) {
    const res = await axios.post(POKEDEX_URL, {
      mode: "load_more",
      pn: page,
      snumber: 1,
      snumber2: 1025,
      sortselval: "number asc,number_count asc",
    });

    // 일단 저장
    await writeFile("./src/pokemon/test.html", res.data);

    pokemons.push(res.data);

    break;

    // 500ms 대기
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // 여기에 컨버팅 코드 입력

  // 종료 단계
  // await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
