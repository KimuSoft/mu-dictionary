export interface BasicWordDict {
  LexicalResource: {
    Lexicon: {
      LexicalEntry: {
        Lemma: LemmaItem | LemmaItem[];
      }[];
    };
  };
}

export interface LemmaItem {
  feat: { val: string };
}
