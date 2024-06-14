## 원신-키뮤사전 컨버터
### 개요
* reference: [GenshinData](https://github.com/Masterain98/GenshinData/blob/main/TextMap/TextMapKR.json)
* reference ID: `genshin`

### 사용법
```bash
bun genshin <소스 파일 경로>
```

### 키뮤사전 지원
| 지원 | 속성               | 속성 설명    | 비고                                           |
|----|------------------|----------|----------------------------------------------|
| ✅  | `origin`         | 원어       |                                              |
| ✅  | `name`           | 단어명      |                                              |
| ✅  | `simplifiedName` | 단순화된 단어명 |                                              |
|    | `definition`     | 단어 정의    | `게임 '원신'에 등장하는 단어`                           |
| ✅  | `pos`            | 품사       | 모든 단어: 명사                                    |
| ✅  | `tags`           | 주제       | `원신`                                         |
| 🚫 | `thumbnail`      | 섬네일      |                                              |
| ✅  | `url`            | 링크       | [원신 게임닷](https://genshin.gamedot.org/) 검색 링크 |

### 데이터 타입
* 스크립트가 요구하는 `TextMapKR.json` 파일은 다음과 같은 구조로 이루어져 있습니다.
```ts
Record<string, string>
```