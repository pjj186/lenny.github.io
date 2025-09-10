---
title: "SQLite Data Type"
description: "SQLite Data Type에 대하여 (쏘 심플)"
thumbnail: "./thumbnail.png"
date: "2025-09-10T16:39:00"
category: "Database"
tags: ["SQL", "SQLite"]
---

SQLite는 상당히 자유로운 친구입니다.

그래서 테이블을 만들때 다음과 같이 만들 수 있습니다.

```sql
CREATE TABLE movies (
  title,
  released,
  overview,
  rating,
  director
);
```

보시다시피 컬럼을 정의할 때 타입을 지정하지 않고 만들 수가 있어요.

그런데 이렇게하면 문제가 생깁니다.

왜냐하면, 각각의 컬럼에 아무값이나 집어넣어도 데이터가 들어간다는건데, 이건 좀 이상하잖아요?

예를들어 rating은 일반적으로 숫자가 들어가야하는데 "abc" 이런걸 넣을 수도 있다고 생각해봅시다.

또 NULL을 넣을수도있고, 날짜를 넣을수도있고.. 아무튼 아무 값이나 다 넣을 수 있다는 것 자체가 조금 이상하잖아요? (사용 사례에 따라 안이상할 수도 있지만..)

그래서 우리는 데이터 타입이 어떤게 있는지 알아야하고, 테이블을 만들때 신경써서 데이터 타입도 같이 명확하게 정의하면서 만들어줘야합니다.

# SQLite Data Type

SQLite에는 다음과 같은 데이터 타입이 있습니다.

| 데이터 타입 | 설명            |
| ----------- | --------------- |
| INTEGER     | 정수            |
| REAL        | 실수            |
| TEXT        | 문자열          |
| BLOB        | 바이너리 데이터 |
| NULL        | NULL            |

> 다른 `RDBMS` 에서는 사용하는 데이터 타입이 다를 수 있습니다.

# 예시

```sql
CREATE TABLE movies (
  title TEXT,
  released INTEGER,
  overview TEXT,
  rating REAL,
  director TEXT
) strict;
```

> 테이블을 생성할 때 strict 키워드가 추가되면 엄격한 타이핑 규칙이 해당 테이블에 적용됩니다.
