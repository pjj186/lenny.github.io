---
title: "SQL 테이블 생성, 삭제, 데이터 추가"
description: "SQL 테이블 생성, 삭제, 데이터 추가"
date: "2025-09-08T21:35:00"
thumbnail: "./thumbnail.png"
category: "Database"
tags: ["SQL", "SQLite"]
---

# DDL이란?

DDL이란 `Data Definition Language` 의 약자로, 데이터베이스 스키마를 정의하는 데 사용되는 언어입니다.

# CREATE TABLE

```sql
CREATE TABLE movies (
  title,
  released,
  overview,
  rating,
  director
);
```

테이블은 위와 같은 명령어로 생성할 수 있슴다. (SQLite 기준)

SQLite가 아닌 다른 DB 기준으로는 위와 같이 생성하면 안될 가능성이 높아여.

정의한 컬럼들의 타입을 정확하게 지정해줘야합니당.

사실 위의 명령어는 그래서 잘 작성한게 아니에여.

옳게 된 작성은 아래와 같습니당.

```sql
CREATE TABLE movies (
  title TEXT,
  released TEXT,
  overview TEXT,
  rating TEXT,
  director TEXT
);
```

대충 이런식으로 어떤 타입인지 명시적으로 지정해줘야합니당.

만든 테이블을 없애려면 다음과 같은 명령어로 없앨 수 있어요.

```sql
DROP TABLE movies;
```

근데 `DROP` 명령어를 쓸 땐 조심해야돼요.

그냥 바로 삭제해버립니다. 데이터 손실이 발생할 수 있어요.

따라서 삭제하기 전에 반드시 확인을 해야돼요. 확인메시지 같은건 없어요..

<hr />

# INSERT INTO VALUES

테이블에 데이터를 집어넣는 명령어에요.

```sql
INSERT INTO movies (title, released, overview, rating, director) VALUES (
'The Dark Knight',
'2008',
'A superhero movie about a man who becomes a superhero and fights crime.',
'8.5',
'Christopher Nolan'
);
```

위와 같이 데이터를 집어넣을 수 있어요.

만약 테이블에 정의된 컬럼이 위 코드에 명시한 5개보다 더 많다면, 위에서 명시되지 않은 컬럼은 자동으로 NULL로 채워집니다.
