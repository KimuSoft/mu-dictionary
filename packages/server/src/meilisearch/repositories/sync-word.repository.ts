export interface SyncWordRepository {
  // 단어 전체를 동기화한다.
  syncAllWords(): Promise<SyncResult>;

  // 단어의 변경사항을 동기화한다.
  syncDiffWords(): Promise<SyncResult>;

  // 특정 reference의 단어를 동기화한다.
  syncRefWords(referenceId: string): Promise<SyncResult>;

  // 자동완성 전체를 동기화한다.
  syncAllAutocomplete(): Promise<SyncResult>;

  // 자동완성의 변경사항만 동기화한다.
  syncDiffAutocomplete(): Promise<SyncResult>;
}

export interface SyncResult {
  inserted: number;
  deleted?: number;
}

export const SYNC_WORD_REPOSITORY = Symbol('SYNC_WORD_REPOSITORY');
