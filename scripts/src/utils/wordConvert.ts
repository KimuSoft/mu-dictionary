// 단순한, 기호 및 영어 등을 한국어로 변환함
export const convertToKorean = (word: string) => {
  // 기호 replacing
  word = word.replace(/%/g, "퍼센트");
  word = word.replace(/#/g, "샵");
  word = word.replace(/[&＆]/g, " 앤드 ");
  word = word.replace(/[+＋]/g, "플러스");
  word = word.replace(/[\-:/·]/g, " ");
  word = word.replace(/(\d)\.(\d)/g, "$1점$2");
  word = word.replace(/[?!]/g, "");

  // 영어 replacing
  word = word.toLowerCase();

  // 9 letter replacing
  word = word.replace(/beautiful/g, "뷰티풀");
  word = word.replace(/signature/g, "시그니처");
  word = word.replace(/evolution/g, "에볼루션");

  // 8 letter replacing
  word = word.replace(/nintendo/g, "닌텐도");
  word = word.replace(/monsters/g, "몬스터즈");
  word = word.replace(/twilight/g, "트와일라잇");
  word = word.replace(/busters/g, "버스터즈");
  word = word.replace(/animation/g, "애니메이션");
  word = word.replace(/remaster/g, "리마스터");
  word = word.replace(/factorio/g, "팩토리오");
  word = word.replace(/families/g, "패밀리즈");
  word = word.replace(/sandwich/g, "샌드위치");
  word = word.replace(/original/g, "오리지널");

  // 7 letter replacing
  word = word.replace(/kingdom/g, "킹덤");
  word = word.replace(/extreme/g, "익스트림");
  word = word.replace(/bonjour/g, "봉주르");
  word = word.replace(/special/g, "스페셜");
  word = word.replace(/another/g, "어나더");
  word = word.replace(/rainbow/g, "레인보우");
  word = word.replace(/windows?/g, "윈도우");
  word = word.replace(/friends/g, "프렌즈");
  word = word.replace(/destiny/g, "데스티니");
  word = word.replace(/journey/g, "저니");
  word = word.replace(/monster/g, "몬스터");
  word = word.replace(/english/g, "잉글리시");
  word = word.replace(/genesis/g, "제네시스");
  word = word.replace(/prelude/g, "프렐류드");
  word = word.replace(/version/g, "버전");
  word = word.replace(/rancher/g, "랜처");
  word = word.replace(/buster/g, "버스터");
  word = word.replace(/cheddar/g, "체다");
  word = word.replace(/choices?/g, "초이스");
  word = word.replace(/project/g, "프로젝트");
  word = word.replace(/episode/g, "에피소드");
  word = word.replace(/vitamin/g, "비타민");
  word = word.replace(/sunkist/g, "선키스트");
  word = word.replace(/premium/g, "프리미엄");
  word = word.replace(/fantasy/g, "판타지");
  word = word.replace(/guilty/g, "길티");
  word = word.replace(/jungle/g, "정글");

  // 6 letter replacing
  word = word.replace(/hearts/g, "하츠");
  word = word.replace(/riders/g, "라이더스");
  word = word.replace(/clover/g, "클로버");
  word = word.replace(/remake/g, "리메이크");
  word = word.replace(/forest/g, "포레스트");
  word = word.replace(/friend/g, "프렌드");
  word = word.replace(/system/g, "시스템");
  word = word.replace(/market/g, "마켓");
  word = word.replace(/switch/g, "스위치");
  word = word.replace(/online/g, "온라인");
  word = word.replace(/combat/g, "컴뱃");
  word = word.replace(/mortal/g, "모탈");
  word = word.replace(/family/g, "패밀리");
  word = word.replace(/master/g, "마스터");
  word = word.replace(/battle/g, "배틀");
  word = word.replace(/canvas/g, "캔버스");
  word = word.replace(/rocket/g, "로켓");
  word = word.replace(/memory/g, "메모리");
  word = word.replace(/genius/g, "지니어스");
  word = word.replace(/dragon/g, "드래곤");
  word = word.replace(/golden/g, "골든");
  word = word.replace(/soccer/g, "축구");
  word = word.replace(/sports/g, "스포츠");
  word = word.replace(/rhythm/g, "리듬");
  word = word.replace(/season/g, "시즌");
  word = word.replace(/answer/g, "앤서");
  word = word.replace(/coffee/g, "커피");
  word = word.replace(/pretty/g, "프리티");
  word = word.replace(/cinema/g, "시네마");
  word = word.replace(/mickey/g, "미키");
  word = word.replace(/puzzle/g, "퍼즐");
  word = word.replace(/panini/g, "파니니");
  word = word.replace(/climax/g, "클라이맥스");
  word = word.replace(/cheese/g, "치즈");
  word = word.replace(/second/g, "세컨드");
  word = word.replace(/sister/g, "시스터");
  word = word.replace(/yogurt/g, "요거트");
  word = word.replace(/series/g, "시리즈");
  word = word.replace(/deluxe/g, "디럭스");
  word = word.replace(/psycho/g, "사이코");
  word = word.replace(/ireland/g, "아일랜드");

  // 5 letter replacing
  word = word.replace(/poker/g, "포커");
  word = word.replace(/rider/g, "라이더");
  word = word.replace(/ultra/g, "울트라");
  word = word.replace(/super/g, "슈퍼");
  word = word.replace(/sword/g, "소드");
  word = word.replace(/thinks?/g, "싱크");
  word = word.replace(/flame/g, "플레임");
  word = word.replace(/magic/g, "매직");
  word = word.replace(/world/g, "월드");
  word = word.replace(/force/g, "포스");
  word = word.replace(/quest/g, "퀘스트");
  word = word.replace(/slime/g, "슬라임");
  word = word.replace(/dream/g, "드림");
  word = word.replace(/happy/g, "해피");
  word = word.replace(/hol+y/g, "홀리");
  word = word.replace(/drive/g, "드라이브");
  word = word.replace(/cross/g, "크로스");
  word = word.replace(/black/g, "블랙");
  word = word.replace(/white/g, "화이트");
  word = word.replace(/heart/g, "하트");
  word = word.replace(/green/g, "그린");
  word = word.replace(/store/g, "스토어");
  word = word.replace(/bacon/g, "베이컨");
  word = word.replace(/light/g, "라이트");
  word = word.replace(/grand/g, "그랜드");
  word = word.replace(/prime/g, "프라임");
  word = word.replace(/heart/g, "하트");
  word = word.replace(/bloom/g, "블룸");
  word = word.replace(/order/g, "오더");
  word = word.replace(/happy/g, "해피");
  word = word.replace(/death/g, "데스");
  word = word.replace(/onion/g, "양파");
  word = word.replace(/hyper/g, "하이퍼");
  word = word.replace(/scape/g, "스케이프");
  word = word.replace(/block/g, "블록");
  word = word.replace(/story/g, "스토리");
  word = word.replace(/girls/g, "걸스");
  word = word.replace(/kakao/g, "카카오");
  word = word.replace(/mouse/g, "마우스");
  word = word.replace(/craft/g, "크래프트");
  word = word.replace(/movie/g, "무비");
  word = word.replace(/under/g, "언더");
  word = word.replace(/salad/g, "샐러드");
  word = word.replace(/robot/g, "로봇");
  word = word.replace(/field/g, "필드");
  word = word.replace(/first/g, "퍼스트");
  word = word.replace(/sweet/g, "스위트");
  word = word.replace(/enter/g, "엔터");
  word = word.replace(/water/g, "워터");
  word = word.replace(/final/g, "파이널");
  word = word.replace(/hello/g, "헬로");
  word = word.replace(/cream/g, "크림");
  word = word.replace(/birth/g, "버스");
  word = word.replace(/power/g, "파워");
  word = word.replace(/pocky/g, "포키");
  word = word.replace(/mania/g, "마니아");
  word = word.replace(/snack/g, "스낵");
  word = word.replace(/metal/g, "메탈");
  word = word.replace(/derby/g, "더비");
  word = word.replace(/lotte/g, "롯데");
  word = word.replace(/watch/g, "워치");
  word = word.replace(/peace/g, "피스");
  word = word.replace(/prices?/g, "프라이스");
  word = word.replace(/juice/g, "주스");
  word = word.replace(/right/g, "라이트");
  word = word.replace(/dress/g, "드레스");
  word = word.replace(/ghost/g, "고스트");
  word = word.replace(/korea/g, "코리아");
  word = word.replace(/catch/g, "캐치");
  word = word.replace(/let's/g, "렛츠");
  word = word.replace(/extra/g, "엑스트라");
  word = word.replace(/devils?/g, "데빌");
  word = word.replace(/stage/g, "스테이지");
  word = word.replace(/grape/g, "그레이프");
  word = word.replace(/apple/g, "애플");
  word = word.replace(/blast/g, "블래스트");
  word = word.replace(/dream/g, "드림");
  word = word.replace(/deemo/g, "디모");
  word = word.replace(/k?night/g, "나이트");
  word = word.replace(/multi/g, "멀티");
  word = word.replace(/chips/g, "칩스");
  word = word.replace(/games/g, "게임즈");

  // 4 letter replacing
  word = word.replace(/cook/g, "쿡");
  word = word.replace(/full/g, "풀");
  word = word.replace(/eyes/g, "아이즈");
  word = word.replace(/mine/g, "마인");
  word = word.replace(/game/g, "게임");
  word = word.replace(/king/g, "킹");
  word = word.replace(/wave/g, "웨이브");
  word = word.replace(/chip/g, "칩");
  word = word.replace(/star/g, "스타");
  word = word.replace(/fate/g, "페이트");
  word = word.replace(/stay/g, "스테이");
  word = word.replace(/time/g, "타임");
  word = word.replace(/duck/g, "덕");
  word = word.replace(/rush/g, "러시");
  word = word.replace(/zero/g, "제로");
  word = word.replace(/c418/g, "시418");
  word = word.replace(/over/g, "오버");
  word = word.replace(/part/g, "파트");
  word = word.replace(/plus/g, "플러스");
  word = word.replace(/dash/g, "대시");
  word = word.replace(/city/g, "시티");
  word = word.replace(/meal/g, "밀");
  word = word.replace(/life/g, "라이프");
  word = word.replace(/dear/g, "디어");
  word = word.replace(/time/g, "타임");
  word = word.replace(/park/g, "파크");
  word = word.replace(/land/g, "랜드");
  word = word.replace(/blue/g, "블루");
  word = word.replace(/dark/g, "다크");
  word = word.replace(/moon/g, "문");
  word = word.replace(/pass/g, "패스");
  word = word.replace(/home/g, "홈");
  word = word.replace(/take/g, "테이크");
  word = word.replace(/auto/g, "오토");
  word = word.replace(/love/g, "러브");
  word = word.replace(/cafe/g, "카페");
  word = word.replace(/dive/g, "다이브");
  word = word.replace(/mini/g, "미니");
  word = word.replace(/road/g, "로드");
  word = word.replace(/come/g, "컴");
  word = word.replace(/true/g, "트루");
  word = word.replace(/bird/g, "버드");
  word = word.replace(/hero/g, "히어로");
  word = word.replace(/back/g, "백");
  word = word.replace(/baby/g, "베이비");
  word = word.replace(/more/g, "모어");
  word = word.replace(/kids/g, "키즈");
  word = word.replace(/milk/g, "밀크");
  word = word.replace(/girl/g, "걸");
  word = word.replace(/pack/g, "팩");
  word = word.replace(/bang/g, "뱅");
  word = word.replace(/sexy/g, "섹시");
  word = word.replace(/mega/g, "메가");
  word = word.replace(/with/g, "위드");
  word = word.replace(/show/g, "쇼");
  word = word.replace(/next/g, "넥스트");
  word = word.replace(/quiz/g, "퀴즈");
  word = word.replace(/gear/g, "기어");
  word = word.replace(/live/g, "라이브");
  word = word.replace(/left/g, "레프트");
  word = word.replace(/from/g, "프롬");
  word = word.replace(/lego/g, "레고");
  word = word.replace(/fire/g, "파이어");
  word = word.replace(/jump/g, "점프");
  word = word.replace(/song/g, "송");
  word = word.replace(/lost/g, "로스트");
  word = word.replace(/nova/g, "노바");
  word = word.replace(/tale/g, "테일");
  word = word.replace(/kick/g, "킥");
  word = word.replace(/club/g, "클럽");
  word = word.replace(/band/g, "밴드");
  word = word.replace(/main/g, "메인");
  word = word.replace(/saga/g, "사가");
  word = word.replace(/ball/g, "볼");
  word = word.replace(/fifa/g, "피파");
  word = word.replace(/hell/g, "헬");
  word = word.replace(/goal/g, "골");
  word = word.replace(/golf/g, "골프");
  word = word.replace(/wait/g, "웨이트");
  word = word.replace(/pure/g, "퓨어");
  word = word.replace(/real/g, "리얼");
  word = word.replace(/type/g, "타입");
  word = word.replace(/seed/g, "시드");
  word = word.replace(/vita/g, "비타");
  word = word.replace(/xbox/g, "엑스박스");
  word = word.replace(/your/g, "유어");
  word = word.replace(/self/g, "셀프");
  word = word.replace(/code/g, "코드");
  word = word.replace(/side/g, "사이드");
  word = word.replace(/pong/g, "퐁");
  word = word.replace(/rock/g, "락");
  word = word.replace(/lady/g, "레이디");
  word = word.replace(/it's/g, "잇츠");
  word = word.replace(/only/g, "온리");
  word = word.replace(/ages?/g, "에이지");
  word = word.replace(/sims/g, "심즈");
  word = word.replace(/hope/g, "호프");

  // 3 letter replacing
  word = word.replace(/3ds/g, "스리디에스");
  word = word.replace(/new/g, "뉴");
  word = word.replace(/sky/g, "스카이");
  word = word.replace(/ceo/g, "시이오");
  word = word.replace(/and/g, "앤");
  word = word.replace(/red/g, "레드");
  word = word.replace(/top/g, "탑");
  word = word.replace(/big/g, "빅");
  word = word.replace(/hot/g, "핫");
  word = word.replace(/spy/g, "스파이");
  word = word.replace(/fun/g, "펀");
  word = word.replace(/mbc/g, "엠비씨");
  word = word.replace(/sbs/g, "에스비에스");
  word = word.replace(/kbs/g, "케이비에스");
  word = word.replace(/run/g, "런");
  word = word.replace(/joy/g, "조이");
  word = word.replace(/cia/g, "시아이에이");
  word = word.replace(/net/g, "넷");
  word = word.replace(/bbq/g, "비비큐");
  word = word.replace(/all/g, "올");
  word = word.replace(/sos/g, "에스오에스");
  word = word.replace(/dha/g, "디에이치에이");
  word = word.replace(/ace/g, "에이스");
  word = word.replace(/max/g, "맥스");
  word = word.replace(/mmo/g, "엠엠오");
  word = word.replace(/fbi/g, "에프비아이");
  word = word.replace(/nba/g, "엔비에이");
  word = word.replace(/pop/g, "팝");
  word = word.replace(/one/g, "원");
  word = word.replace(/two/g, "투");
  word = word.replace(/sun/g, "선");
  word = word.replace(/ova/g, "오브이에이");
  word = word.replace(/box/g, "박스");
  word = word.replace(/sim/g, "심");
  word = word.replace(/you/g, "유");
  word = word.replace(/sea/g, "씨");
  word = word.replace(/bit/g, "비트");
  word = word.replace(/ice/g, "아이스");
  word = word.replace(/tnt/g, "티엔티");
  word = word.replace(/kbo/g, "케이비오");
  word = word.replace(/toy/g, "토이");
  word = word.replace(/rpm/g, "알피엠");
  word = word.replace(/act/g, "액트");
  word = word.replace(/the ([aiueo])/g, "디 $1");
  word = word.replace(/the/g, "더");
  word = word.replace(/god/g, "갓");
  word = word.replace(/pop/g, "팝");
  word = word.replace(/mix/g, "믹스");
  word = word.replace(/ace/g, "에이스");
  word = word.replace(/rpg/g, "알피지");
  word = word.replace(/diy/g, "디아이와이");
  word = word.replace(/bar/g, "바");
  word = word.replace(/set/g, "세트");
  word = word.replace(/wii/g, "위");
  word = word.replace(/egg/g, "에그");
  word = word.replace(/ps5/g, "플레이스테이션 5");
  word = word.replace(/ps4/g, "플레이스테이션 4");
  word = word.replace(/ps3/g, "플레이스테이션 3");
  word = word.replace(/ps2/g, "플레이스테이션 2");
  word = word.replace(/ps1/g, "플레이스테이션 1");
  word = word.replace(/psv/g, "플레이스테이션 비타");

  word = word.replace(/for/g, "포");
  word = word.replace(/ufo/g, "유에프오");
  word = word.replace(/oad/g, "오에이디");
  word = word.replace(/i'm/g, "아임");
  word = word.replace(/ver/g, "버전");
  word = word.replace(/yes/g, "예스");
  word = word.replace(/cat/g, "캣");
  word = word.replace(/abc/g, "에이비시");
  word = word.replace(/hug/g, "허그");
  word = word.replace(/la/g, "엘에이");
  word = word.replace(/id/g, "아이디");
  word = word.replace(/dmz/g, "디엠지");
  word = word.replace(/of/g, "오브");
  word = word.replace(/dog/g, "도그");
  word = word.replace(/ag/g, "에이지");
  word = word.replace(/dp/g, "디피");
  word = word.replace(/war/g, "워");
  word = word.replace(/tcg/g, "트레이딩 카드 게임");
  word = word.replace(/dr\.?/g, "닥터 ");
  word = word.replace(/ms\.?/g, "미스 ");
  word = word.replace(/mr\.?/g, "미스터 ");
  word = word.replace(/vol.?\s?(\d+)/g, "$1편");

  // 2 letter replacing
  word = word.replace(/mm/g, "밀리미터");
  word = word.replace(/4d/g, "포디");
  word = word.replace(/3d/g, "스리디");
  word = word.replace(/2d/g, "투디");
  word = word.replace(/go/g, "고");
  word = word.replace(/up/g, "업");
  word = word.replace(/tv/g, "티비");
  word = word.replace(/hi/g, "하이");
  word = word.replace(/by/g, "바이");
  word = word.replace(/no/g, "노");
  word = word.replace(/my/g, "마이");
  word = word.replace(/me/g, "미");
  word = word.replace(/we/g, "위");
  word = word.replace(/us/g, "어스");
  word = word.replace(/it/g, "잇");
  word = word.replace(/ex/g, "이엑스");
  word = word.replace(/is/g, "이즈");
  word = word.replace(/us/g, "어스");
  word = word.replace(/sd/g, "에스디");
  word = word.replace(/be/g, "비");
  word = word.replace(/by/g, "바이");
  word = word.replace(/do/g, "두");
  word = word.replace(/on/g, "온");
  word = word.replace(/at/g, "앳");
  word = word.replace(/or/g, "오어");
  word = word.replace(/vs/g, "버서스");
  word = word.replace(/ok/g, "오케이");
  word = word.replace(/dx/g, "디럭스");
  word = word.replace(/kg/g, "킬로그램");
  word = word.replace(/ai/g, "에이아이");
  word = word.replace(/so/g, "소");
  word = word.replace(/do/g, "두");
  word = word.replace(/up/g, "업");
  word = word.replace(/gs/g, "지에스");
  word = word.replace(/to/g, "투");
  word = word.replace(/in/g, "인");
  word = word.replace(/pc/g, "피시");
  word = word.replace(/vr/g, "브이알");
  word = word.replace(/mv/g, "무비");
  word = word.replace(/av/g, "에이브이");
  word = word.replace(/iq/g, "아이큐");
  word = word.replace(/cd/g, "시디");
  word = word.replace(/cd/g, "시디");
  word = word.replace(/ar/g, "에이알");
  word = word.replace(/xl/g, "엑스라지");
  word = word.replace(/bj/g, "비제이");
  word = word.replace(/hd/g, "에이치디");
  word = word.replace(/cj/g, "씨제이");
  word = word.replace(/re/g, "리");
  word = word.replace(/ds/g, "디에스");
  word = word.replace(/pk/g, "피케이");
  word = word.replace(/ps/g, "플레이스테이션");
  word = word.replace(/ns/g, "닌텐도 스위치");
  word = word.replace(/ml/g, "밀리리터");
  word = word.replace(/cu/g, "씨유");
  word = word.replace(/lv/g, "레벨");
  word = word.replace(/cm/g, "센티미터");

  word = word.trim();

  // 1 letter replacing

  // 숫자 표현
  word = word.replace(/1st/g, "퍼스트");
  word = word.replace(/2nd/g, "세컨드");
  word = word.replace(/3rd/g, "서드");
  word = word.replace(/4th/g, "포스");
  word = word.replace(/5th/g, "피프스");

  // roman number replacing
  word = word.replace(/viii/g, "8");
  word = word.replace(/xiii/g, "13");
  word = word.replace(/iii/g, "3");
  word = word.replace(/vii/g, "7");
  word = word.replace(/xii/g, "12");
  word = word.replace(/vi/g, "6");
  word = word.replace(/ix/g, "9");
  word = word.replace(/xi/g, "11");
  word = word.replace(/ii/g, "2");
  word = word.replace(/iv/g, "4");
  word = word.replace(/i/g, "1");
  word = word.replace(/v/g, "5");
  word = word.replace(/x/g, "10");

  word = word.replace(/\s{2,}/g, " ");
  word = word.replace(/(\d+)g/g, "$1그램");
  word = word.replace(/(\d+)l/g, "$1리터");
  word = word.replace(/(\d+)m/g, "$1미터");
  word = word.replace(/a\s/g, "어");
  word = word.replace(/a$/g, "에이");
  word = word.replace(/b$/g, "비");
  word = word.replace(/c$/g, "시");
  word = word.replace(/d$/g, "디");
  word = word.replace(/e$/g, "이");
  word = word.replace(/f$/g, "에프");
  word = word.replace(/g$/g, "지");
  word = word.replace(/h$/g, "에이치");
  word = word.replace(/i$/g, "아이");
  word = word.replace(/j$/g, "제이");
  word = word.replace(/k$/g, "케이");
  word = word.replace(/l$/g, "엘");
  word = word.replace(/m$/g, "엠");
  word = word.replace(/n$/g, "엔");
  word = word.replace(/o$/g, "오");
  word = word.replace(/p$/g, "피");
  word = word.replace(/q$/g, "큐");
  word = word.replace(/r$/g, "알");
  word = word.replace(/s$/g, "에스");
  word = word.replace(/t$/g, "티");
  word = word.replace(/u$/g, "유");
  word = word.replace(/v/g, "브이");
  word = word.replace(/w$/g, "더블유");
  word = word.replace(/x/g, "엑스");
  word = word.replace(/y/g, "와이");
  word = word.replace(/z/g, "지");

  word = word.replace(/([^A-z])a([^A-z])/g, "$1에이$2");
  word = word.replace(/([^A-z])b([^A-z])/g, "$1비$2");
  word = word.replace(/([^A-z])c([^A-z])/g, "$1시$2");
  word = word.replace(/([^A-z])d([^A-z])/g, "$1디$2");
  word = word.replace(/([^A-z])e([^A-z])/g, "$1이$2");
  word = word.replace(/([^A-z])f([^A-z])/g, "$1에프$2");
  word = word.replace(/([^A-z])g([^A-z])/g, "$1지$2");
  word = word.replace(/([^A-z])h([^A-z])/g, "$1에이치$2");
  word = word.replace(/([^A-z])i([^A-z])/g, "$1아이$2");
  word = word.replace(/([^A-z])j([^A-z])/g, "$1제이$2");
  word = word.replace(/([^A-z])k([^A-z])/g, "$1케이$2");
  word = word.replace(/([^A-z])l([^A-z])/g, "$1엘$2");
  word = word.replace(/([^A-z])m([^A-z])/g, "$1엠$2");
  word = word.replace(/([^A-z])n([^A-z])/g, "$1엔$2");
  word = word.replace(/([^A-z])o([^A-z])/g, "$1오$2");
  word = word.replace(/([^A-z])p([^A-z])/g, "$1피$2");
  word = word.replace(/([^A-z])q([^A-z])/g, "$1큐$2");
  word = word.replace(/([^A-z])r([^A-z])/g, "$1알$2");
  word = word.replace(/([^A-z])s([^A-z])/g, "$1에스$2");
  word = word.replace(/([^A-z])t([^A-z])/g, "$1티$2");
  word = word.replace(/([^A-z])u([^A-z])/g, "$1유$2");
  word = word.replace(/([^A-z])v([^A-z])/g, "$1브이$2");
  word = word.replace(/([^A-z])w([^A-z])/g, "$1더블유$2");
  word = word.replace(/([^A-z])x([^A-z])/g, "$1엑스$2");
  word = word.replace(/([^A-z])y([^A-z])/g, "$1와이$2");
  word = word.replace(/([^A-z])z([^A-z])/g, "$1지$2");

  // 한자 replacing
  return word.trim();
};

// 단어를 넣으면 mudict 단어 형식으로 변환함. mudict 단어 형식에 적합하지 않은 경우 null을 반환함.
export const wordConvert = (
  word: string,
): {
  // 단어의 원형
  origin: string;
  // 한국어, 숫자, 띄어쓰기 및 사전기호(^, -)만을 허용함
  name: string;
  // 한국어, 숫자만을 허용함
  simplifiedName: string;
} | null => {
  // 모든 기호 제거
  const name = convertToKorean(word)
    .replace(/[^a-zA-Z0-9ㄱ-ㅎ가-힣ㅏ-ㅣ\s]/g, "")
    .trim();

  // 영어가 제거가 안 되는 경우 null을 반환함
  if (!/^[가-힣0-9\s]+$/.test(name)) {
    return null;
  }

  // 한국어, 숫자만을 허용함
  const simplifiedName = name.replace(/[^가-힣0-9]/g, "");

  return {
    origin: word.trim(),
    name,
    simplifiedName,
  };
};