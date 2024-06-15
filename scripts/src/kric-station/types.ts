export interface SubwayStation {
  stationCode: string; // Station code
  stationName: string; // Station name
  lineCode: string; // Line code
  lineName: string; // Line name
  englishStationName: string; // English station name
  chineseStationName: string; // Chinese station name
  transferType: string; // Transfer station type (e.g., "도시철도 환승역" or "도시철도 일반역")
  transferLineCode: string; // Transfer line code (if applicable)
  transferLineName: string; // Transfer line name (if applicable)
  latitude: number; // Latitude of the station
  longitude: number; // Longitude of the station
  operatingAgency: string; // Operating agency (e.g., "서울교통공사")
  address: string; // Station address
  phoneNumber: string; // Station phone number
  dataStandardDate: string; // Data standard date (e.g., "2024-02-29")
}
