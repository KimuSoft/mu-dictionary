// https://www.nl.go.kr/NL/contents/N31101030500.do

export interface ISBNSearchRequest {
  cert_key: string;
  result_style: "xml" | "json";
  page_no?: string;
  page_size?: string;
  start_publish_date?: string;
  end_publish_date?: string;
  publisher?: string;
  title?: string;
  ebook_yn?: "Y" | "N";
}

export interface ISBNSearchResponse {
  TOTAL_COUNT: number;
  PAGE_NO: string;
  docs: ISBNItem[];
}

export interface ISBNItem {
  TITLE: string;
  VOL: string;
  AUTHOR: string;
  EA_ISBN: string;
  EA_ADD_CODE: string;
  PUBLISHER: string;
  PRE_PRICE: string;
  KDC: string;
  DDC: string;
  PAGE: string;
  BOOK_SIZE: string;
  SET_ISBN: string;
  PUBLISH_PREDATE: string;
  SUBJECT: string;
  TITLE_URL: string;
  // 목차
  BOOK_TB_CNT_URL: string;
  // 책 소개
  BOOK_INTRODUCTION_URL: string;
  // 책 요약
  BOOK_SUMMARY_URL: string;
  PUBLISHER_URL: string;
  INPUT_DATE: string;
  UPDATE_DATE: string;
}
