export interface WordInfo {
  word_unit: string;
  word: string;
  original_language_info?: {
    original_language: string;
    language_type: string;
  }[];
  pronunciation_info?: { pronunciation: string }[];
  word_type: string;
}

export interface SenseInfo {
  definition: string;
  cat_info?: {
    cat: string;
  }[];
  relation_info: {
    link: string;
    target_code: number;
    word: string;
    type: string;
  }[];
  sense_no: string;
  translation_info: {
    translation: string;
    language_type: string;
  }[];
  type: "일반어" | "지역어(방언)" | "북한어" | "옛말";
  definition_original: string;
  pos: string;
}

export interface WordData {
  wordinfo: WordInfo;
  group_order: number;
  group_code: number;
  link: string;
  target_code: number;
  senseinfo: SenseInfo;
}

export interface DictionaryFile {
  total: number;
  title: string;
  description: string;
  item: WordData[];
}
