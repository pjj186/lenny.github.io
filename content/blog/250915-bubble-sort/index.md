---
title: "버블 정렬 (Bubble Sort)"
description: "버블 정렬 알고리즘"
date: "2025-09-15T10:53:00"
thumbnail: "./thumbnail.png"
category: "Algorithm"
tags: ["Algorithm", "Sorting"]
---

안녕하세요. 이번글은 버블 정렬 알고리즘이에요.

# 버블 정렬 (Bubble Sort)

버블 정렬이 뭘까요.

일단 시각적으로 한번 보는게 좋을것 같아요.

[Visualgo - Sorting](https://visualgo.net/en/sorting)

여기서 상단에 "Bubble Sort" 선택 후 왼쪽 하단에 "Sort" 버튼을 누르시면 시각적으로 버블 정렬이 어떻게 동작하는지 확인할 수 있어요.

다음은 버블정렬을 자바스크립트 코드로 구현한 예시입니다.

```ts
function bubbleSort(arr) {
  let noSwaps;

  for (let i = arr.length; i > 0; i--) {
    noSwaps = true;
    for (let j = 0; j < i - 1; j++) {
      // SWAP 로직
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        noSwaps = false;
      }
    }
    if (noSwaps) break;
  }

  return arr;
}
```

> `noSwaps` 변수는 굳이 Swap이 필요하지 않은 상황일 때 Swap 하는 상황을 방지하기 위하여 선언한 변수에요.

기본적으로 위와같이 구현할 수 있습니다.

위 로직에서 For문에서 i를 배열의 길이로 먼저 설정하는 이유는 의미있는 반복을 하기 위해서에요.

만약 i를 0부터 `arr.length` 까지 반복한다고하면 반복문은 다음과 같이 바뀌어야할거에요.

```ts
for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr.length; j++) {
    // ...
  }
}
```

반복문 부분을 위 처럼 작성해도 동작은 할거에요.
대신 안쪽 For문은 무조건 `arr.length` 만큼 반복하게되요.

버블정렬 특성상 한 사이클을 지나고나면, 맨 뒤 요소는 고정이 되는데 말이에요.

그래서 해당 반복문 부분을

```ts
for (let i = arr.length; i > 0; i--) {
  for (let j = 0; j < i - 1; j++) {}
}
```

이렇게 작성하게되면, 이미 정렬된 맨 뒤 요소까지는 Swap 로직을 실행하지 않게되서 좀 더 효율적이게 되는것이죠.

여기까지 버블정렬 알아봤구요

감사합니다
