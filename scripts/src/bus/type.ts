export interface BusStopData {
  // 정류장 번호
  stopNumber: string;

  // 정류장 이름
  stopName: string;

  // 위도
  latitude?: number;

  // 경도
  longitude?: number;

  // 모바일단축번호
  mobileNumber?: number;

  // 도시코드
  cityCode?: number;

  // 도시명
  cityFullName: string;

  // 관리도시명
  operatorCity: string;
}
