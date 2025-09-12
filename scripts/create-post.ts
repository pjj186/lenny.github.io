import inquirer from "inquirer"
import fs from "fs"
import path from "path"

const createBlogPost = async () => {
  console.log("블로그 포스트 생성하기\n")

  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "folderName",
        message: "폴더 이름을 입력해주세요.",
        validate: (input: string) => {
          if (!input.trim()) {
            return "폴더 이름은 필수입니다!"
          }
          // 폴더명에 특수문자 제한
          if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
            return "폴더 이름은 영문, 숫자, -, _ 만 사용 가능합니다!"
          }
          return true
        },
      },
      {
        type: "input",
        name: "title",
        message: "제목을 입력하세요:",
        validate: (input: string) => {
          if (!input.trim()) {
            return "제목은 필수입니다!"
          }
          return true
        },
      },
      {
        type: "input",
        name: "description",
        message: "설명을 입력하세요:",
        validate: (input: string) => {
          if (!input.trim()) {
            return "설명은 필수입니다!"
          }
          return true
        },
      },
      {
        type: "input",
        name: "category",
        message: "카테고리를 입력하세요:",
        validate: (input: string) => {
          if (!input.trim()) {
            return "카테고리는 필수입니다!"
          }
          return true
        },
      },
      {
        type: "input",
        name: "tags",
        message: "태그를 입력하세요 (쉼표로 구분):",
        validate: (input: string) => {
          if (!input.trim()) {
            return "태그는 필수입니다!"
          }
          return true
        },
      },
    ])

    // 현재 시간을 ISO 형식으로 생성
    const now = new Date()
    const date = now
      .toLocaleString("sv-SE", { timeZone: "Asia/Seoul" })
      .replace(" ", "T")

    // 태그를 배열로 변환
    const tagsArray = answers.tags
      .split(",")
      .map((tag: string) => `"${tag.trim()}"`)
      .join(", ")

    // 마크다운 템플릿 생성
    const markdownTemplate = `---
title: "${answers.title}"
description: "${answers.description}"
date: "${date}"
thumbnail: "./thumbnail.png"
category: "${answers.category}"
tags: [${tagsArray}]
---
`

    // 폴더 경로 설정
    const folderPath = path.join(
      process.cwd(),
      "content",
      "blog",
      answers.folderName
    )
    const filePath = path.join(folderPath, "index.md")

    // 폴더가 이미 존재하는지 확인
    if (fs.existsSync(folderPath)) {
      console.log(`❌ 폴더 "${answers.folderName}"가 이미 존재합니다!`)
      return
    }

    // 폴더 생성
    fs.mkdirSync(folderPath, { recursive: true })

    // 마크다운 파일 생성
    fs.writeFileSync(filePath, markdownTemplate, "utf8")

    console.log(`✅ 블로그 포스트가 성공적으로 생성되었습니다!`)
    console.log(`📁 경로: ${filePath}`)
    console.log(`\n💡 다음 단계:`)
    console.log(`   1. ${folderPath}에 thumbnail.png 이미지를 추가하세요`)
    console.log(`   2. index.md 파일을 열어서 내용을 작성하세요`)
  } catch (error: any) {
    if (error.isTtyError) {
      console.log("❌ 인터랙티브 프롬프트를 사용할 수 없는 환경입니다.")
    } else {
      console.log("❌ 오류가 발생했습니다:", error.message)
    }
  }
}

createBlogPost()
