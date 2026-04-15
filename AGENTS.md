# PDF Editor — AGENTS.md (지도/Map)

> 이 파일은 ~100줄 목차 역할만 합니다. 세부 내용은 각 링크된 문서를 참조하세요.
> "인컨텍스트에서 접근할 수 없는 것은 존재하지 않는 것과 같다." — HarnessEngineering

---

## 프로젝트 개요

**PDF 편집기** — PDF 파일 뷰어 + 어노테이션 + 저장/내보내기 웹앱.
기술 스택: Vite + React + TypeScript + react-pdf + pdf-lib + Konva + Zustand + Zod

---

## 문서 구조

- `ARCHITECTURE.md` — 전체 아키텍처, 레이어 규칙, 의존성 방향
- `docs/design-docs/` — 설계 결정 문서
- `docs/exec-plans/active/` — 현재 진행 중인 실행 계획 (세이브 포인트)
- `docs/exec-plans/completed/` — 완료된 실행 계획
- `docs/golden-rules.md` — 불변량 규칙 (linter 기준)
- `docs/QUALITY_SCORE.md` — 도메인/레이어별 품질 점수

---

## 소스 구조

```
src/
├── domains/          # 비즈니스 도메인 (각자 Types→Config→Repo→Service→UI)
│   ├── pdf/          # PDF 로드/렌더링 도메인
│   ├── annotation/   # 어노테이션 도메인 (하이라이트, 드로잉, 노트)
│   └── toolbar/      # 툴바/도구 선택 도메인
├── providers/        # 공통 관심사 (PdfProvider, ThemeProvider)
├── utils/            # 순수 함수 유틸 (사이드이펙트 없음)
└── app/              # 앱 진입점, 레이아웃, 라우팅
```

---

## 도메인별 책임

| 도메인 | 책임 |
|--------|------|
| `pdf` | PDF 파일 로드, 페이지 렌더링, 줌/페이지 이동 |
| `annotation` | 어노테이션 CRUD, Konva Canvas 오버레이 |
| `toolbar` | 현재 활성 도구 상태, 도구별 옵션 |

---

## 핵심 불변량 (→ `docs/golden-rules.md` 참조)

1. UI는 Service를 통해서만 데이터 접근 (Repo 직접 접근 금지)
2. 외부 입력은 Zod로 경계 파싱
3. `any` 타입 금지 (TypeScript strict)
4. Zustand store → 컴포넌트 (역방향 상태 흐름 금지)
5. utils는 순수 함수만

---

## 현재 세이브 포인트

→ `docs/exec-plans/active/` 폴더의 파일 확인

---

## 주요 외부 라이브러리

| 패키지 | 용도 | 문서 |
|--------|------|------|
| `react-pdf` | PDF.js 기반 React 뷰어 | https://react-pdf.org |
| `pdf-lib` | PDF 생성/수정/플래튼 | https://pdf-lib.js.org |
| `react-konva` | Canvas 2D 어노테이션 레이어 | https://konvajs.org/docs/react |
| `zustand` | 전역 상태 관리 | https://zustand-demo.pmnd.rs |
| `zod` | 런타임 타입 검증 | https://zod.dev |
