---
title: "슬라이딩 윈도우(Sliding Window) 알고리즘"
description: "sliding window 알고리즘 기록용"
date: "2025-09-12T21:02:22"
thumbnail: "./thumbnail.png"
category: "Algorithm"
tags: ["Algorithm"]
---

# 슬라이딩 윈도우 (Sliding Window) 알고리즘

슬라이딩 윈도우 알고리즘은 배열이나 문자열에서 특정 크기의 윈도우를 이동하며 특정 조건을 만족하는 부분을 찾는 알고리즘이에요.

```ts
function maxSubarraySum(arr, num) {
  let maxSum = 0
  let tempSum = 0
  if (arr.length < num) return null
  for (let i = 0; i < num; i++) {
    maxSum += arr[i]
  }
  tempSum = maxSum
  for (let i = num; i < arr.length; i++) {
    tempSum = tempSum - arr[i - num] + arr[i]
    maxSum = Math.max(maxSum, tempSum)
  }
  return maxSum
}
```

위 코드는 슬라이딩 윈도우 알고리즘을 이용한 코드인데요.

배열을 이동하면서, num의 수 만큼 배열의 요소를 더하고, 그 중 가장 큰 값을 반환하는 코드에요.

에를들어서

```ts
maxSubarraySum([2, 6, 9, 2, 1, 8, 5, 6, 3], 3)
```

우선 위 함수의 결과로는 19가 나옵니다.

함수를 이렇게 호출한다고 해볼께요.

그러면 2, 6, 9 를 일단 더하고 그 다음 6, 9, 2 를 더하고 서로 비교해요. 대충 이런식으로 배열을 순회하면서

가장 큰 값을 반환하는 솔루션이에요.

마치 창문이 슬라이딩 하는것 같죠?

```
[2, 6, 9] 2, 1, 8, 5, 6, 3 -> 합 17
2, [6, 9, 2] 1, 8, 5, 6, 3 -> 합 17
2, 6, [9, 2, 1] 8, 5, 6, 3 -> 합 12
2, 6, 9, [2, 1, 8] 5, 6, 3 -> 합 11
2, 6, 9, 2, [1, 8, 5] 6, 3 -> 합 14
2, 6, 9, 2, 1, [8, 5, 6] 3 -> 합 19
2, 6, 9, 2, 1, 8, [5, 6, 3] -> 합 14
```

(대충 창문이 슬라이딩 같다는 걸 이해시키려고 작성함)

그래서 슬라이딩 윈도우다 이말입니다~ 엣헴.

이 알고리즘의 핵심 로직은 아무래도

```ts
for (let i = num; i < arr.length; i++) {
  tempSum = tempSum - arr[i - num] + arr[i]
  maxSum = Math.max(maxSum, tempSum)
}
```

이 부분일텐데요.

특히 이 부분에서도

```ts
tempSum = tempSum - arr[i - num] + arr[i]
```

이부분이죠.

이 부분이 슬라이딩 윈도우를 해주고있습니다요.

보시면 이전 합계(tempSum)에서 첫번째 요소를 빼고 새로운 요소를 더해주고 있어요.

```ts
// num = 3 (창문크기)

// for 문 진입시 i = 3 (num 값)
// 여기서 왜 i에 num 값을 넣냐면

[2, 6, 9] 2, 1, 8, 5, 6, 3

// 위의 합계는 이미

  for (let i = 0; i < num; i++) {
    maxSum += arr[i]
  }

// 함수 처음에 이렇게 합게를 구해놓고 시작하기 때문에
// i = 3 으로 해줘야 배열이 이동하는 형상을 보이겠져?
// i는 인덱스로 쓰이니깐여.

// 아무튼 핵심 로직을 한번 타면 아래와 같은 그림이됩니다.

// tempSum = tempSum - arr[i - num] + arr[i]
// 여기서 arr[i - num] 이 arr[3 - 3] 이니까 배열의 첫번째 인덱스잖아요?
// 그 값을 빼주는거에요.

// tempSum = tempSum - arr[i - num] + arr[i] 이 식을
// tempSum = tempSum  ,  - arr[i - num] ,  + arr[i] 이렇게 나눠서 생각해보면 이해가 쉬워요.


[2, 6, 9], 2, 1, 8, 5, 6, 3

// 여기서 arr[0] 을 빼면

2, [6, 9], 2, 1, 8, 5, 6, 3

// 이런 형상이되겟져?

// 그 다음 + arr[i] 를 해주니깐

2, [6, 9, 2], 1, 8, 5, 6, 3

// 이렇게 되는거에요
```

이해가 잘 됐으면 좋겠네요.

제가 알고리즘 실력도 처참하고 설명을 막 잘하는편이아니라 설명이 길어서 더 어려울 수 있겠지만..

봐주셔서 감사함다.
