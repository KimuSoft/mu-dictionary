## <이름>-키뮤사전 컨버터
### 개요
* reference: `Stardew Valley`
* reference ID: `stardew_valley`

### 사용법
* xnb_node를 사용해서 .../Stardew Valley/Content/Strings 폴더 내의 모든 데이터를 언패킹합니다.
* 언팩된 데이터에 `bun stardew-valley <path>`을 사용합니다.
```bash
bun stardew-valley <path>
```

### 키뮤사전 지원
| 지원 | 속성               | 속성 설명    | 비고                                          |
|----|------------------|----------|---------------------------------------------|
| ✅  | `origin`         | 원어       |                                             |
| ✅  | `name`           | 단어명      |                                             |
| ✅  | `simplifiedName` | 단순화된 단어명 |                                             |
| 🚫 | `definition`     | 단어 정의    |                                             |
| ✅  | `pos`            | 품사       | 모든 단어: 명사                                   |
| ✅  | `tags`           | 주제       | `<주제>`                                      |
| ✅  | `url`            | 링크       |  
| 🚫 | `thumbnail`      | 미리보기 이미지 |                                             |

### 데이터 타입
* 스크립트가 요구하는 `<이름>` 파일은 다음과 같은 구조로 이루어져 있습니다.
```ts 
Record<string, string>
```