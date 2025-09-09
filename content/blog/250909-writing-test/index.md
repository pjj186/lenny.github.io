---
title: "Playwright 테스트 작성하기"
description: "Playwright 탐구기록"
thumbnail: "./thumbnail.png"
date: "2025-09-09T16:34:00"
category: "playwright"
tags: ["Playwright", "E2E", "Test"]
---

안녕하세요. 이번 포스팅에서는 Playwright 테스트 작성에 대해 기록해보려고합니다요.

> Playwright 테스트는 간단합니다: 작업을 수행하고 예상 결과와 상태를 비교하여 검증합니다. <br/>
> Playwright는 각 작업을 수행하기 전에 실행 가능성 검사를 자동으로 기다립니다. 수동으로 대기 시간을 추가하거나 경쟁 조건(race condition)을 처리할 필요가 없습니다. <br/>
> Playwright의 단언(assertion)은 결국 충족될 것으로 예상되는 기대치를 설명하도록 설계되어, 불안정한 타임아웃과 경쟁 상태 검사를 제거합니다.

# 시작

```ts
import { test, expect } from "@playwright/test"

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/")

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/)
})

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/")

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click()

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible()
})
```

위 코드는 playwright 설치 시 같이 딸려오는 예제코드인데욤.

이 예제코드를 바탕으로 PlayWright 테스트코드 작성의.. 기본적인 핵심?을 알아볼게요.

공식문서에서는 Playwight는 **액션**을 수행하고, 상태를 **단언**하여 예상과 일치하는지 확인한다고 나와있어요.

그래서 Action과 Assertion 두 가지를 중심으로 알아보려고해요.

# Actions

액션은 쉽게 이해하면, 브라우저에서 하는 모든 동작을 의미해요.

클릭이나 페이지 이동, 입력 등 브라우저에서 사용자가 조작하는 모든 동작을 의미한다고 볼 수 있어요.

대부분의 테스트는 먼저 URL로 이동하는 것으로 시작해요.

```ts
await page.goto("https://playwright.dev/")
```

그 이후 페이지의 요소들과 서로 상호작용하죵.

page.goto 함수는 페이지를 이동시키는 함수에요.
자세한 내용은 [여기](https://playwright.dev/docs/api/class-page#page-goto)에서 확인할 수 있어요.

## 상호작용

```ts
// Create a locator.
const getStarted = page.getByRole("link", { name: "Get started" })

// Click it.
await getStarted.click()
```

페이지에서 요소를 찾고, 그 다음 클릭하는 코드에요.

위 경우에는 페이지에서 요소를 찾을때, page.getByRole 함수를 사용했어요.

이제 이런걸 Locator 라고 부르는데, 여러가지 종류가 있어요.

[여기](https://playwright.dev/docs/locators)서 Locator의 종류를 확인할 수 있어요.

다양합니다!

```ts
// Click the get started link.
await page.getByRole("link", { name: "Get started" }).click()
```

위 코드처럼 한줄로 줄여서 작성할 수 도 있어요!

다음은 playwright에서 흔하게 사용되는 액션들이에요.

| Action                    | Description                          |
| ------------------------- | ------------------------------------ |
| `locator.check()`         | checkbox input을 체크합니다.         |
| `locator.click()`         | 요소를 클릭합니다.                   |
| `locator.uncheck()`       | checkbox input의 체크를 해제합니다.  |
| `locator.hover()`         | 마우스를 요소 위에 올립니다.         |
| `locator.fill()`          | 폼 필드에 텍스트를 입력합니다.       |
| `locator.focus()`         | 요소에 포커스를 줍니다.              |
| `locator.press()`         | 키를 누릅니다.                       |
| `locator.setInputFiles()` | 파일을 업로드합니다.                 |
| `locator.selectOption()`  | 드롭다운 메뉴에서 옵션을 선택합니다. |

위 테이블에서 `locator` 는 `page.getByRole` 이런식으로 뭔가 요소가 선택된 코드들을 말한다고 생각하시면 됨미당.

# Assertions (단언문)

Playwright는 `expect` 함수 형태의 테스트 단언문(assertions)을 포함하고있어요.

단언문을 만들려면 expect(value)를 호출하고 예상하는 바를 반영하는 매처(matcher)를 선택하세요.

> Playwright에는 예상 조건이 충족될 때까지 기다리는 비동기 매처가 포함되어있어요. 이런 비동기 매처를 사용하면 테스트를 좀 더 안정적으로 할 수 있어요.

```ts
await expect(page).toHaveTitle(/Playwright/)
```

위 코드는 페이지 제목에 "Playwright"가 포함될 때까지 기다리는 코드에요.

다음은 자주 사용되는 Assertion 목록이에요.

| Assertion                           | Description                            |
| ----------------------------------- | -------------------------------------- |
| `expect(locator).toBeChecked()`     | 체크박스가 체크되어 있는지 확인        |
| `expect(locator).toBeEnabled()`     | 컨트롤이 활성화되어 있는지 확인        |
| `expect(locator).toBeVisible()`     | 요소가 화면에 보이는지 확인            |
| `expect(locator).toContainText()`   | 요소에 특정 텍스트가 포함되었는지 확인 |
| `expect(locator).toHaveAttribute()` | 요소에 특정 속성이 있는지 확인         |
| `expect(locator).toHaveCount()`     | 요소 목록이 특정 개수인지 확인         |
| `expect(locator).toHaveText()`      | 요소의 텍스트가 일치하는지 확인        |
| `expect(locator).toHaveValue()`     | 입력 요소에 특정 값이 있는지 확인      |
| `expect(page).toHaveTitle()`        | 페이지 제목이 맞는지 확인              |
| `expect(page).toHaveURL()`          | 페이지 URL이 맞는지 확인               |

> `toEqual`, `toContain`, `toBeTruthy` 와 같은 일반적인 매처(matcher)도 포함하고 있으며, 이들은 어떤 조건이든 검증하는 데 사용할 수 있어요. 이러한 단언문들은 이미 사용 가능한 값에 대해 즉시 동기적 검사를 수행하기 때문에 await 키워드를 사용하지 않아요.

## 독립적인 테스트

playwright는 독립적으로 테스트를 실행해요.

각 테스트마다 완전히 새로운 브라우저 환경을 제공하고 그 환경에서 테스트를 진행함니당.

그래서 이전의 테스트가 현재의 테스트에 영향을 주지않는다네요~

```ts
import { test } from "@playwright/test"

test("example test", async ({ page }) => {
  // "page" belongs to an isolated BrowserContext, created for this specific test.
})

test("another test", async ({ page }) => {
  // "page" in this second test is completely isolated from the first test.
})
```

## 테스트 훅

테스트 훅이라는 테스트 자체를 조정하는? 그런 함수들이 있는데여.

아래 예제에서 나온 `test.describe` 와 `test.beforeEach` 가 그런 훅들이에요.

`test.describe` 는 테스트를 그룹으로 정의하는? 그런 훅이에요.

연관된 테스트들끼리 묶어서 관리하면 가독성차원에서 좋을 것 같네욤.

이어서 등장하는 `test.beforeEach` 는 각 테스트 전/후에 실행되는 훅이에요.

이외에도 여러가지가 있는데 [여기](https://playwright.dev/docs/api/class-test)에서 확인해보세욤.

```ts
import { test, expect } from "@playwright/test"

test.describe("navigation", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto("https://playwright.dev/")
  })

  test("main navigation", async ({ page }) => {
    // Assertions use the expect API.
    await expect(page).toHaveURL("https://playwright.dev/")
  })
})
```
