---
summary: "PDF 편집기 - PDF 뷰어, 어노테이션, 저장/내보내기"
icon: "📝"
tags: ["pdf", "editor", "annotation", "viewer"]
---

# 사용 기술

- Vite
- React
- TypeScript
- react-pdf (PDF 뷰어)
- pdf-lib (PDF 생성/수정)
- react-konva (Canvas 2D 어노테이션)
- Zustand (상태 관리)
- Zod (런타임 타입 검증)

# 프로젝트 구조

```
src/
  domains/             # 비즈니스 도메인
    pdf/               # PDF 로드/렌더링 도메인
    annotation/        # 어노테이션 도메인 (하이라이트, 드로잉, 노트)
    toolbar/           # 툴바/도구 선택 도메인
  providers/           # 공통 관심사 (PdfProvider, ThemeProvider)
  utils/               # 순수 함수 유틸 (사이드이펙트 없음)
  app/                 # 앱 진입점, 레이아웃, 라우팅
```

# 기능

## PDF 뷰어
- PDF 파일 로드
- 페이지 렌더링
- 줌 기능
- 페이지 이동

## 어노테이션
- 하이라이트
- 드로잉
- 노트
- CRUD 연산

## 도구 모음
- 현재 활성 도구 상태
- 도구별 옵션

## 저장/내보내기
- PDF 저장
- 어노테이션 포함 내보내기

# 도메인별 책임

| 도메인 | 책임 |
|--------|------|
| `pdf` | PDF 파일 로드, 페이지 렌더링, 줌/페이지 이동 |
| `annotation` | 어노테이션 CRUD, Konva Canvas 오버레이 |
| `toolbar` | 현재 활성 도구 상태, 도구별 옵션 |

# 핵심 규칙

- UI는 Service를 통해서만 데이터 접근 (Repo 직접 접근 금지)
- 외부 입력은 Zod로 경계 파싱
- `any` 타입 금지 (TypeScript strict)
- Zustand store → 컴포넌트 (역방향 상태 흐름 금지)
- utils는 순수 함수만

# 주요 라이브러리

| 패키지 | 용도 |
|--------|------|
| `react-pdf` | PDF.js 기반 React 뷰어 |
| `pdf-lib` | PDF 생성/수정/플래튼 |
| `react-konva` | Canvas 2D 어노테이션 레이어 |
| `zustand` | 전역 상태 관리 |
| `zod` | 런타임 타입 검증 |
