export const getMapLinkData = (latitude: number, longitude: number) => ({
  naverMap: `https://map.naver.com/?lng=${latitude}&lat=${longitude}`,
  kakaoMap: `https://map.kakao.com/link/map/${latitude},${longitude}`,
  googleMap: `https://google.co.kr/maps/place/${latitude},${longitude}`,
  kakaoRoadView: `https://map.kakao.com/link/roadview/${latitude},${longitude}`,
})
