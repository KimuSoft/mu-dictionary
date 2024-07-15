export interface LawSearchResponse {
  LawSearch?: {
    totalCnt: number;
    page: number;
    law?: LawItem[];
  };
  AdmRulSearch?: {
    totalCnt: number;
    page: number;
    admrul?: RuleItem[];
  };
  OrdinSearch?: {
    totalCnt: number;
    page: number;
    law?: LocalLawItem[];
  };
}

// 자치법규 결과 아이템
export interface LocalLawItem {
  자치법규일련번호: number;
  자치법규명: string;
  자치법규ID: number;
  공포일자: number;
  공포번호: number;
  제개정구분명: "제정";
  지자체기관명: string;
  자치법규종류: string;
  시행일자: number;
  자치법규상세링크: string;
  자치법규분야명: string;
  참조데이터구분: number;
}

// 행정규칙 결과 아이템
export interface RuleItem {
  행정규칙일련번호: number;
  행정규칙명: string;
  행정규칙종류: string;
  발령일자: number;
  발령번호: number;
  소관부처명: string;
  현행연혁구분: "현행";
  제개정구분코드: number;
  제개정구분명: "제정";
  행정규칙ID: number;
  행정규칙상세링크: string;
  시행일자: number;
  생성일자: number;
}

// 법령정보 결과
export interface LawItem {
  법령일련번호: number;
  현행연혁코드: "현행";
  법령명한글: string;
  법령약칭명: string;
  법령ID: number;
  공포일자: number;
  공포번호: number;
  제개정구분명: "제정";
  소관부처코드: number;
  소관부처명: string;
  법령구분명: "법률" | "대통령령";
  공동부령정보: string;
  시행일자: number;
  자법타법여부: string;
  법령상세링크: string;
}
