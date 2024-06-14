## 마인크래프트-키뮤사전 컨버터
### 개요
* reference: Minecraft Ko_kr.json lang file
* reference ID: `minecraft`

### 사용법
```bash
bun minecraft <소스 파일 경로>
```

### 키뮤사전 지원
| 지원 | 속성               | 속성 설명    | 비고                                                                         |
|----|------------------|----------|----------------------------------------------------------------------------|
| ✅  | `origin`         | 원어       |                                                                            |
| ✅  | `name`           | 단어명      |                                                                            |
| ✅  | `simplifiedName` | 단순화된 단어명 |                                                                            |
| ✅ | `definition`     | 단어 정의    | description이 존재하는 단어만 지원                                                   |
| ✅  | `pos`            | 품사       | 모든 단어: 명사                                                                  |
| ✅  | `tags`           | 주제       | `마인크래프트`                                                                   |
| 🚫 | `thumbnail`      | 섬네일      |                                                                            |
| ✅  | `url`            | 링크       | [한국어 마인크래프트 위키](https://minecraft.fandom.com/ko/wiki/Minecraft_Wiki) 문서 링크 |

### 데이터 타입
* 스크립트가 요구하는 `ko_kr.json` 파일은 다음과 같은 구조로 이루어져 있습니다.
```ts
Record<string, string>
```