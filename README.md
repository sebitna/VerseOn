# 말씀On (VerseOn)

신앙 생활에 필요한 성경 말씀을 찾아주는 모바일 우선 웹앱입니다.  
사용자가 **문장으로 마음을 입력**하거나 **16가지 신앙 주제**를 선택하면, Gemini가 관련 구절(장·절)을 추천하고 앱 내 성경 데이터로 본문을 검증·표시합니다.

GitHub: [sebitna/VerseOn](https://github.com/sebitna/VerseOn)

---

## 주요 기능

### 1. 문장 입력 → 말씀 추천
- 궁금한 점이나 마음의 내용을 **한 줄 입력창**에 적고 말씀을 받을 수 있습니다.
- 긴 문장은 입력창이 **자동으로 세로로 늘어납니다.**
- 입력·결과 문장은 **왼쪽 정렬**로 읽기 쉽게 표시됩니다.

### 2. 16가지 신앙 주제 (4×4 버튼)
| | | | |
|---|---|---|---|
| 믿음 | 기도 | 예배 | 말씀 |
| 은혜 | 회개 | 거룩 | 사랑 |
| 소망 | 평안 | 순종 | 전도 |
| 시험 | 감사 | 교제 | 인도 |

### 3. 하이브리드 AI + 성경 DB
- Gemini는 **구절 참조(책·장·절)만** 반환합니다.
- 실제 본문은 로컬 JSON(`ko`/`zh`/`en`)에서 조회해 **환각 구절을 방지**합니다.
- API 실패 시 카테고리별 **시드 구절 fallback**으로 동작합니다.

### 4. 다국어 지원
- UI: 한국어 / 中文 / English
- 성경 본문: 개혁개정(KO) · 和合本(ZH) · WEB(EN) 큐레이션 subset

### 5. 모바일 UX
- 연한 핑크 배경 + **볼록한 투명 젤리 버튼** UI
- 구절 카드 스와이프, Web Share API
- 언어 전환 시 UI·말씀 본문 **즉시 반영**

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React 19, Vite 8, TypeScript, Tailwind CSS 4 |
| i18n | react-i18next |
| AI | Google Gemini 2.5 Flash |
| API | Vercel Serverless Function (`api/recommend.ts`) |
| 배포 | Vercel, GitHub Actions CI |

---

## 아키텍처

```
사용자 입력(문장/주제)
    ↓
/api/recommend  →  Gemini (구절 참조 JSON)
    ↓
bibleLookup.ts  →  로컬 성경 JSON 검증
    ↓
VerseCard UI  →  말씀 2~3구절 표시
```

---

## 로컬 실행

```bash
npm install
cp .env.example .env.local
# .env.local에 GEMINI_API_KEY 입력
```

### 프론트 + API (권장)

```bash
npm run dev
```

Vite dev 서버에 `/api/recommend` 미들웨어가 포함되어 있어, `npm run dev`만으로 Gemini API까지 테스트할 수 있습니다.

### Vercel CLI로 전체 스택

```bash
npx vercel dev
```

---

## 환경 변수

| 변수 | 위치 | 설명 |
|------|------|------|
| `GEMINI_API_KEY` | `.env.local` / Vercel | Google Gemini API 키 (서버 전용, Git 제외) |

키 발급: [Google AI Studio](https://aistudio.google.com/apikey)

---

## Vercel 배포

1. [GitHub 저장소](https://github.com/sebitna/VerseOn)에 코드 push
2. [Vercel](https://vercel.com) → **Add New Project** → `VerseOn` Import
3. Framework Preset: **Vite**
4. Environment Variables: `GEMINI_API_KEY` 추가
5. **Deploy**

---

## 프로젝트 구조

```
api/recommend.ts              # Vercel Serverless — Gemini 호출
lib/recommendVerses.ts        # Gemini 프롬프트·API 공통 로직
src/api/verse.ts              # 클라이언트 fetch
src/components/
  QuestionInput.tsx             # 문장 입력 (자동 높이 조절)
  CategoryGrid.tsx              # 4×4 주제 버튼
  VerseCard.tsx                 # 말씀 카드
src/data/bible/                 # KO/ZH/EN 성경 subset + seeds
src/hooks/useVerseRecommend.ts  # 말씀 로딩·언어 전환
src/i18n/                       # 다국어 UI
src/utils/bibleLookup.ts        # ref → 본문 검증
vite.config.ts                  # dev API 미들웨어
```

---

## 개발·수정 이력

### 초기 구현
- React + Vite + TypeScript + Tailwind 프로젝트 스캐폴딩
- Gemini 하이브리드 구절 추천 (참조만 AI, 본문은 로컬 DB)
- 3개 언어 UI 및 성경 subset 데이터

### API·환경 수정
| 이슈 | 해결 |
|------|------|
| OpenAI → Gemini 전환 요청 | `OPENAI_API_KEY` → `GEMINI_API_KEY`, Gemini API 연동 |
| `gemini-2.0-flash` 404 오류 | `gemini-2.5-flash` 모델로 변경 |
| `.env.local` 키가 두 줄로 분리되어 API 미동작 | `GEMINI_API_KEY=키` 한 줄 형식으로 수정 |
| `npm run dev`에서 `/api/recommend` 404 | Vite dev 미들웨어 추가 (`vite.config.ts`) |
| Vercel dev 프로젝트명 한글 오류 | `verse-on` 이름으로 Vercel 프로젝트 연결 |

### 기능 추가
| 항목 | 내용 |
|------|------|
| 문장 입력 | `QuestionInput` — 궁금한 내용을 문장으로 입력해 말씀 추천 |
| 신앙 주제 16개 | 고민 카테고리 → 믿음·기도·예배 등 16개 키워드로 교체 |
| 언어 즉시 전환 | 언어 버튼 클릭 시 UI·말씀 본문 즉시 반영 (`{ lng }` + storedRefs 재조회) |

### UI/UX 개선
| 항목 | 내용 |
|------|------|
| 4×4 그리드 | 16개 주제 버튼을 4열 배치, 작은 글씨 |
| 연한 핑크 테마 | 배경·글자 대비색 조정 |
| 젤리 버튼 | 볼록한 투명 glassmorphism 버튼 스타일 (`.jelly-btn`) |
| 왼쪽 정렬 | 입력창·말씀 본문·나의 마음 문장 왼쪽 정렬 |
| 한 줄 입력창 | 초기 1줄, 긴 문장 입력 시 자동 높이 확장 (최대 ~6줄) |
| 태그라인 제거 | 헤더 부제 "신앙 생활에 필요한 말씀을 찾아보세요" 제거 |

---

## 저작권 안내

개혁개정 성경 전체 텍스트는 대한성서공회 저작권 대상입니다.  
본 프로젝트는 **교육용 큐레이션 subset**을 사용하며, 상용 배포 시 별도 라이선스 검토가 필요합니다.

---

## 라이선스

Private — 교육용 MVP
