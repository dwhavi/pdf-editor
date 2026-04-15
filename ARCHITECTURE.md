# Architecture

## 레이어드 도메인 아키텍처

HarnessEngineering §5 적용. 각 도메인은 단방향 의존성을 가집니다.

```
Types → Config → Repo → Service → UI
```

공통 관심사는 Providers를 통해서만 진입:
```
Auth / Theme / PDF Context → Providers → Domains
```

Utils는 도메인 외부 (어떤 도메인도 import하지 않는 순수 함수)

---

## 의존성 방향 규칙

```
┌─────────────────────────────────────────┐
│  app/  (진입점, 레이아웃 조합)           │
│    ↓                                    │
│  domains/pdf/ui                         │
│  domains/annotation/ui                  │
│  domains/toolbar/ui                     │
│    ↓ (UI는 Service만 호출)              │
│  domains/*/service.ts                   │
│    ↓ (Service는 Repo만 호출)            │
│  domains/*/repo.ts                      │
│    ↓                                    │
│  domains/*/types.ts, config.ts          │
│    ↓                                    │
│  providers/   (Cross-cutting concerns)  │
│  utils/       (Pure functions only)     │
└─────────────────────────────────────────┘
```

## 파일 크기 제한

- 컴포넌트: 200줄 이하
- service.ts: 300줄 이하
- 초과 시 분리 필수

## 상태 관리 패턴

- Zustand store는 `src/domains/*/store.ts`
- 컴포넌트는 store에서 읽기만, store는 service를 통해 변경
