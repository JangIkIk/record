---
title: "Github Page 블로그용 Markdown 빌드 & gray-matter 파싱 문제 정리"
date: "2025-09-23"
tags: [Markdown, Github, gray-matter, build]
slug: "Markdown"
---

# Github Page 블로그용 Markdown 빌드 & gray-matter 파싱 문제 정리

## 1. 문제 1: Markdown 파일 slug 생성 시 한글/공백 문제

**설명**

* 블로그 게시글을 작성할 때, 폴더명을 날짜 + 제목(slug) 형태로 자동 생성하고 싶었다.
* 예: `"Github Page를 만들게된 과정"` → `2025-09-23-github-page`
* 기존 코드에서는 한글이 포함되거나 공백이 제대로 하이픈으로 변환되지 않는 문제가 발생

**원인**

* `slugify` 함수에서 특수문자 제거 정규식이 한글과 공백을 제대로 처리하지 못했음
* `replace(/[^\w\-가-힣]/g, "")` 는 특수문자 제거용이었지만 공백 변환 순서와 겹치면서 의도한 slug가 나오지 않음

**해결 방법**

* 먼저 공백/언더바를 하이픈으로 변환 후, 특수문자를 제거하도록 순서 조정
* 최종적으로 연속된 하이픈 제거 및 앞뒤 하이픈 제거
* 필요 시, 한글 제외하고 영문/숫자만 허용하도록 정규식 수정 가능

**코드 예시**

```ts
function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // 공백/언더바 → 하이픈
    .replace(/[^\w\-]/g, "") // 특수문자 제거 (영문/숫자만 허용)
    .replace(/-+/g, "-") // 연속된 하이픈 → 하나로
    .replace(/^-+|-+$/g, ""); // 앞뒤 하이픈 제거
}
```

---

## 2. 문제 2: Markdown frontmatter 파싱 및 JSON 주석 불편함

**설명**

* 기존 index.md 파일에서 frontmatter를 주석 형태의 JSON으로 작성

  ```md
  <!-- Meta
  {
    "title": "제목을 입력해주세요",
    "date": "2025-09-23",
    "tags": ["react", "vite"],
    "slug": "github-page"
  }
  -->

  <!-- Content -->
  내용작성
  ```
* 여러 개의 태그를 작성하거나 JSON 형식으로 데이터를 관리하는 것이 점점 불편하고, `tags`나 문자열 값 작성 시 유효하지 않은 JSON으로 오류 발생
* `gray-matter`를 도입하면서, 이 JSON 주석을 보다 편리하게 관리 가능한 **YAML frontmatter** 형식으로 변경

**원인**

* JSON 주석 형식에서는 배열이나 문자열에 실수하면 `JSON.parse`에서 오류 발생
* 브라우저 환경에서는 gray-matter가 내부적으로 Node.js `Buffer`를 필요로 하여 오류 발생

**해결 방법**

1. 기존 JSON 주석 → gray-matter 지원 **YAML frontmatter** 형태로 변경

   ```md
   ---
   title: "제목을 입력해주세요"
   date: "2025-09-23"
   tags:
     - react
     - vite
   slug: "github-page"
   ---

   내용작성
   ```
2. 배열, 문자열 작성이 YAML 문법으로 더 직관적
3. React에서 `gray-matter`를 사용해 바로 `data`와 `content`로 분리 가능
4. 브라우저 환경에서도 **Vite polyfill 설정**을 통해 안전하게 처리 가능

---

## 3. 문제 3: React에서 useState 타입 오류

**설명**

* React에서 Markdown을 gray-matter로 읽어 `postList` 상태에 저장
* `PostMeta` 타입 정의: `{ title, date, tags, slug, contentPreview }`
* 파싱된 객체를 `setPostList([...posts])`에 넣으니 타입 오류 발생

**원인**

* gray-matter의 `data` 타입이 TypeScript에서 명확히 보장되지 않음
* 따라서 `{ contentPreview: string }`만 존재한다고 판단 → PostMeta와 불일치

**해결 방법**

1. 타입 단언(Type Assertion) 사용

```ts
return { ...(data as Omit<PostMeta, "contentPreview">), contentPreview };
```

2. 명시적 구조화

```ts
return {
  title: data.title as string,
  date: data.date as string,
  tags: data.tags as string[],
  slug: data.slug as string,
  contentPreview,
};
```

* 초기에는 명시적 구조화로 안전하게 처리하는 것을 권장

---

## 4. 문제 4: 브라우저 환경에서 gray-matter 실행 시 Buffer 오류

**설명**

* 클라이언트에서 gray-matter를 사용하면 `Buffer is not defined` 오류 발생
* React + Vite 환경에서 브라우저가 Node.js `Buffer`를 제공하지 않기 때문

**원인**

* 브라우저에는 Node.js 전역 객체(`Buffer`)가 없으며, Vite는 Node 전용 모듈을 외부 처리(externalized)

**해결 방법**

* \*\*Vite 설정(`vite.config.ts`)\*\*에서 Node globals polyfill을 적용

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      define: { global: "globalThis" },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true, // 브라우저에서 Buffer 사용 가능
        }),
      ],
    },
  },
});
```

* 클라이언트 코드에서 별도로 `window.Buffer`를 선언할 필요 없음

---

## 5. 최종 설계 요약

1. **Markdown 양식**: YAML frontmatter + 본문
2. **slug 생성**: 날짜 + slugified title

   * `2025-09-23-github-page`
3. **React 상태 관리**: PostMeta 타입에 맞게 contentPreview 포함
4. **빌드/배포 전략**:

   * GitHub Actions에서 Markdown → JSON 변환
   * 브라우저에서는 변환된 JSON만 사용 → Buffer/polyfill 문제 없음
5. **Vite polyfill**로 클라이언트에서 gray-matter 안전하게 사용 가능

