---
title: "[TIL] SQLite Constraints (제약조건)"
description: "[TIL]SQLite Constraints"
thumbnail: "./thumbnail.png"
date: "2025-09-10T20:00:00"
category: "TIL"
tags: ["SQL", "SQLite"]
---

SQLite에서 테이블을 대충 만들면 안좋은 사태가 발생합니다;

만약 테이블을 다음과 같이 만든다고 해볼게요.

```sql
CREATE TABLE movies (
  title TEXT,
  released INTEGER,
  overview TEXT,
  rating REAL,
  director TEXT
) strict;
```

오.. 뭐 그래도 타입도 들어가있고 썩 나쁘지 않아보입니다.

근데 문제가 있어요.

`rating` 요런데에 음수를 집어넣을 수 있다거나, DB에 중복된 이름으로 데이터가 여러개 있을 수 있다던가.. 그런 부분들이요.

이번 포스팅에서는 그런걸 막기위해 하는 제약조건에 대해 적어볼거에염.

# 제약조건 (Constraints)

일단 제약조건 거는 코드부터 떤질게염.

```sql
CREATE TABLE movies (
  title TEXT UNIQUE NOT NULL,
  released INTEGER NOT NULL,
  overview TEXT NOT NULL,
  rating REAL NOT NULL,
  director TEXT
  for_adults INTEGER NOT NULL DEFAULT 0
) strict;
```

이런식으로 테이블 만들 때 걸어줄 수 있습니다.

보시면 데이터 타입 정의하는 부분 뒤에 막 붙죠? 이게 바로 제약조건이에염.

이름에서 유추 할 수 있듯이 `UNIQUE` 는 중복된 값을 허용하지 않는다는 뜻이고, `NOT NULL` 은 해당 컬럼에 NULL을 허용하지 않는다는 뜻이에염.

`DEFAULT` 는 해당 컬럼에 기본값을 설정한다는 뜻이에염.

이런식으로 제약조건을 걸어줄 수 있어염.

데이터를 넣을때 이제 저 조건에 맞춰서 안넣으면 에러가 나게 될것이에요.

# 제약조건 종류 (Constraints Types)

SQLite에서 제약조건은 다음과 같은 종류가 있구염.

| 제약조건    | 설명                                |
| ----------- | ----------------------------------- |
| UNIQUE      | 중복된 값을 허용하지 않는다.        |
| NOT NULL    | 해당 컬럼에 NULL을 허용하지 않는다. |
| DEFAULT     | 해당 컬럼에 기본값을 설정한다.      |
| CHECK       | 해당 컬럼에 조건을 추가한다.        |
| PRIMARY KEY | 해당 컬럼을 기본키로 설정한다.      |

CHECK 써서 좀 더 복잡한 제약조건을 만들 수 있어염.

이렇게!

```sql
CREATE TABLE movies (
  title TEXT UNIQUE NOT NULL,
  released INTEGER NOT NULL,
  overview TEXT NOT NULL,
  rating REAL NOT NULL,
  director TEXT
  for_adults INTEGER NOT NULL DEFAULT 0 CHECK (for_adults = 0 OR for_adults = 1)
) strict;
```

이렇게 하면 `for_adults` 컬럼에는 0 또는 1만 들어갈 수 있어염.

```sql
(for_adults > -1 OR for_adults < 2)
```

이런것도 되고

```sql
(for_adults BETWEEN 0 AND 1)
```

이런것도 됩니다.

<hr/>

간단하게 제약조건에 대해서 알아봤습니다~

그럼 이만~
