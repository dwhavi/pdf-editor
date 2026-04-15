# Golden Rules — 불변량

> 이 규칙들은 기계적으로 검증 가능해야 한다. (HarnessEngineering §5)

## GR-1: 도메인 경계
UI 컴포넌트는 `service.ts`를 통해서만 데이터에 접근한다.
`repo.ts`를 직접 import하는 UI 파일이 있으면 위반.

## GR-2: 경계 파싱
외부 입력(파일 업로드, URL 파라미터, API 응답)은 반드시 Zod schema로 파싱한다.
raw cast (`as SomeType`) 금지.

## GR-3: TypeScript Strict
`any` 타입 사용 금지. `tsconfig.json`의 `strict: true` 유지.
불가피한 경우 `// eslint-disable` 주석 + 사유 명시.

## GR-4: 상태 단방향
Zustand store → 컴포넌트 방향만 허용.
컴포넌트가 store의 내부 setter를 직접 호출하지 않고 service 함수를 통해서만 변경.

## GR-5: Utils 순수성
`src/utils/`의 모든 함수는 순수 함수여야 한다.
외부 상태, DOM, 네트워크 접근 금지. 사이드이펙트 없음.

## GR-6: 파일 크기
- 컴포넌트 파일: 200줄 이하
- service.ts: 300줄 이하
초과 시 즉시 분리 리팩토링.

## GR-7: 상대 import
도메인 간 import는 절대 경로(`@/domains/...`) 사용.
`../../..` 형태의 깊은 상대 경로 금지.
