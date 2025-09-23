import fs from "fs";
import path from "path";

// 파일형식 변환 함수
function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // 공백/언더바 → 하이픈
    .replace(/[^\w\-가-힣]/g, "") // 특수문자 제거 (한글/영문/숫자만 허용)
    .replace(/-+/g, "-") // 연속된 하이픈 → 하나로
    .replace(/^-+|-+$/g, ""); // 앞뒤 하이픈 제거
}

// scripts 함수
function createPost(slug: string) {
  // 제목 검증
  if (!slug) {
    console.error("제목 입력필요");
    process.exit(1);
  }

  //  제목을 기준으로 검증
  const slugMapper = slugify(slug);
  const date = new Date().toISOString().split("T")[0];
  // 저장될위치 검증
  const postsDir = path.join("src", "entities", "posts", "md", `${date}-${slugMapper}`);

  // 게시글 폴더
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
    console.log(`게시글 폴더 생성: ${postsDir}`);
  } else {
    console.error("게시글 폴더 중복");
    process.exit(1);
  }

  // md 파일 경로 및 양식
  const mdPath = path.join(postsDir, "index.md");
  const content = `---
title: "제목을 입력해주세요"
date: "${date}"
tags: []
slug: "${slug}"
---

내용 작성
`;

  // md 파일 생성 및 양식 적용
  fs.writeFileSync(mdPath, content, "utf-8");

  // 게시글 images 폴더
  const imgDir = path.join(postsDir, "images");
  fs.mkdirSync(imgDir, { recursive: true });
}

// CLI
const args = process.argv.slice(2);
createPost(args[0]);
