---
title: "이진 검색 알고리즘"
description: "binary search(이진 검색) 알고리즘 기록용"
date: "2025-09-12T20:13:18"
thumbnail: "./thumbnail.png"
category: "Algorithm"
tags: ["Algorithm"]
---

# 이진 검색(Binary Search) 알고리즘

이진 검색 알고리즘은 **정렬**된 배열에서 특정 값을 찾는 알고리즘이에요.

```ts
function binarySearch(arr, elem) {
  let start = 0
  let end = arr.length - 1
  let middle = Math.floor((start + end) / 2)

  while (arr[middle] !== elem && start <= end) {
    if (elem < arr[middle]) {
      end = middle - 1
    } else {
      start = middle + 1
    }
    middle = Math.floor((start + end) / 2)
  }

  if (arr[middle] === elem) {
    return middle
  }

  return -1
}
```

위 코드는 이진검색 알고리즘을 구현한 자바스크립트 코드에요.

자바스크립트 코드를 보면 알 수 있듯이, 이진검색 알고리즘은 정렬된 배열에서 특정 값을 찾는 알고리즘이에요.

`start` 변수는 시작 인덱스를 나타내고, `end` 변수는 끝 인덱스를 나타내요.

`middle` 변수는 주어진 배열의 중간 인덱스를 나타냅니당.

```ts
while (arr[middle] !== elem && start <= end) {
  if (elem < arr[middle]) {
    end = middle - 1
  } else {
    start = middle + 1
  }
  middle = Math.floor((start + end) / 2)
}
```

이 로직이 핵심로직이 될텐데요.

값을 찾거나 배열 전체를 모두 순회할(start <= end)때까지 반복하는 루프로 시작을해요.

찾는 값이 현재 중간값보다 작으면 끝 인덱스를 중간 인덱스 - 1로 업데이트해요.

왜냐면 찾는값이 중간값보다 왼쪽에 있을거니까 기존 배열의 오른쪽 반을 버리는거져.

반대로 찾는값이 중간값보다 크면 시작 인덱스를 중간 인덱스 + 1로 업데이트해요.

원리는 똑같아여. 찾는값이 중간값보다 큰 지점에 있으니까 왼쪽을 다 버리는거에여.

그 다음 중간값의 인덱스 업데이트하고 위 과정을 계속 반복해요.

```ts
if (arr[middle] === elem) {
  return middle
}

return -1
```

이 후 값을 찾으면 해당 값이 있는 인덱스를 반환하구, 없으면 -1을 반환해요.
