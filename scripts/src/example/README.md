## <이름>-키뮤사전 컨버터
### 개요
* reference: [출처명](링크)
* reference ID: `아이디(소문자 영어)`

### 사용법
```bash
bun <이름> <소스 파일 경로>
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