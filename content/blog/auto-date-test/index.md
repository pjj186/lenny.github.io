---
title: "자동 날짜 테스트 글"
description: "날짜 필드가 없는 글입니다. autoDate 기능 테스트를 위한 포스트입니다."
thumbnail: "../hello-world/salty_egg.jpg"
category: "테스트"
tags: ["자동날짜", "테스트", "개발"]
---

# 자동 날짜 테스트

이 글은 autoDate 기능을 테스트하기 위해 작성된 포스트입니다. Frontmatter에 date 필드가 의도적으로 생략되었습니다.

## 자동 날짜란?

Gatsby 프로젝트에서 구현한 `autoDate` 기능은 마크다운 파일에 날짜 정보가 없을 때 파일 생성 시간을 자동으로 날짜로 사용합니다.

### 동작 방식

1. `onCreateNode` 훅에서 date가 없는 마크다운 파일 감지
2. 파일의 생성 시간 가져오기 (birthTime 또는 ctime)
3. 이를 `autoDate` 필드로 노드에 추가
4. GraphQL에서 쿼리하여 사용

## 테스트 결과

이 글의 날짜가 자동으로 표시되었다면, `autoDate` 기능이 정상적으로 작동한 것입니다!

```javascript
// 코드 테스트
function testAutoDate() {
  console.log("자동 날짜 기능이 작동합니다!")
}
```

> 인용구 테스트
>
> 여러 줄에 걸친 인용구 테스트입니다.

마크다운 요소 렌더링도 함께 테스트할 수 있습니다.
