---
title: "DML (Data Manipulation Language)"
description: "Data Manipulation Language?"
date: "2025-09-18T23:27:00"
thumbnail: "./thumbnail.png"
category: "Database"
tags: ["SQL", "SQLite"]
---

# DML (Data Manipulation Language)

데이터를 조작하는 언어에요.

명령어는 크게 두 분류로 나뉘어요.

1. Update : 데이터를 추가하거나 수정하는 명령어, 데이터의 상태를 변화시키는? 그런 명령어들
2. Query : 데이터를 조회하는 명령어

<hr/>

## Update Commands

Update 명령어는 어떤것들이 있는지 한번 살펴보겠습니다.

### INSERT INTO VALUES

테이블에 데이터를 추가하는 명령어에요.

문법은 다음과 같습니다.

```sql
INSERT INTO table_name (column1, column2, column3, ...) VALUES (value1, value2, value3, ...);
```

> 사용 예시
>
> ```sql
> INSERT INTO movies (title, released, overview, rating, director) VALUES (
> 'The Dark Knight',
> '2008',
> 'A superhero movie about a man who becomes a superhero and fights crime.',
> '8.5',
> 'Christopher Nolan'
> );
> ```

### UPDATE

테이블에 데이터를 수정하는 명령어에요.

문법은 다음과 같습니다.

```sql
UPDATE table_name SET column1 = value1, column2 = value2, ... WHERE condition;
```

<span style="color:orange">🚨 주의해야 할 점은 WHERE 조건이 없으면 테이블의 모든 데이터가 수정된다는 점이에요.</span>

> 사용 예시
>
> ```sql
> UPDATE movies SET title = 'The Dark Knight' WHERE id = 1;
> ```

### DELETE

테이블에 데이터를 삭제하는 명령어에요.

문법은 다음과 같습니다.

```sql
DELETE FROM table_name WHERE condition;
```

> 사용 예시
>
> ```sql
> DELETE FROM movies WHERE id = 1;
> ```

## Query Commands

Query 명령어는 어떤것들이 있는지 한번 살펴보겠습니다.

### SELECT

테이블에 데이터를 조회하는 명령어에요.

문법은 다음과 같습니다.

```sql
SELECT column1, column2, ... FROM table_name WHERE condition;
```

`FROM` 이 먼저 실행되어 movies 테이블의 모든 데이터를 가져오고 `SELECT` 로 어떤 컬럼을 결과물로 보여줄지 지정합니다.

> 사용 예시
>
> ```sql
> SELECT * FROM movies;
> ```

다음과 같이 별칭을 붙여서도 조회할 수 있어요.

```sql
SELECT title AS movie_title,
    released AS movie_released,
    overview AS movie_overview,
    rating AS movie_rating,
    director AS movie_director
FROM movies;
```

별칭을 붙이면 조회된 데이터의 컬럼명을 변경할 수 있습니당.

다음과 같이 연산자도 쓸 수 있구요.

```sql
SELECT rating * 2 AS double_rating FROM movies;
```

이렇게 작성하면 rating 컬럼의 값을 2배로 곱한 값이 double_rating 컬럼에 조회됩니다.

## WHERE

WHERE 절은 조회할 데이터의 조건을 지정하는 명령어임니다.

위에서 봤듯이 여러가지 문법과 조합해서 사용할 수 있죵.

SELECT와 함께 사용할때도 WHERE 절을 사용하여 조회하려는 데이터의 범위를 좁힐 수 있습니다.

```sql
SELECT * FROM movies WHERE rating > 8;
```

이렇게 작성하면 rating 컬럼의 값이 8보다 큰 데이터만 조회됩니다.

다음과 같이 여러 조건을 조합해서 사용할 수 있어요.

```sql
SELECT * FROM movies WHERE rating > 8 AND director = 'Christopher Nolan';
```

### AND, OR

WHERE 절에서 AND, OR 조건을 사용할 수 있어요.

AND 조건은 두 조건이 모두 참일 때 조회돼요.

```sql
SELECT * FROM movies WHERE rating > 8 AND director = 'Christopher Nolan';
```

이렇게 작성하면 rating 컬럼의 값이 8보다 크고 director 컬럼의 값이 'Christopher Nolan'인 데이터만 조회됩니다.

OR 조건은 두 조건 중 하나라도 참일 때 조회돼요.

```sql
SELECT * FROM movies WHERE rating > 8 OR director = 'Christopher Nolan';
```

이렇게 작성하면 rating 컬럼의 값이 8보다 크거나 director 컬럼의 값이 'Christopher Nolan'인 데이터만 조회됩니다.

### BETWEEN AND

BETWEEN AND 조건은 두 값 사이의 범위에 해당하는 데이터를 조회할 수 있어요.

```sql
SELECT * FROM movies WHERE rating BETWEEN 8 AND 9;
```

이렇게 작성하면 rating 컬럼의 값이 8과 9 사이인 데이터만 조회됩니다.

### IN

IN 조건은 여러 값 중 하나에 해당하는 데이터를 조회할 수 있어요.

```sql
SELECT * FROM movies WHERE director IN ('Christopher Nolan', 'Quentin Tarantino');
```

이렇게 작성하면 director 컬럼의 값이 'Christopher Nolan' 또는 'Quentin Tarantino'인 데이터만 조회됩니다.

### LIKE (%, \_)

LIKE 조건은 특정 패턴에 해당하는 데이터를 조회할 수 있어요.

`%` 는 0개 이상의 문자를 의미하고, `_` 는 1개의 문자를 의미합니다.

다음과 같이 사용할 수 있어요.

```sql
SELECT * FROM movies WHERE director LIKE 'N%';
```

이렇게 작성하면 director 컬럼의 값이 'N'으로 시작하는 데이터만 조회됩니다.

```sql
SELECT * FROM movies WHERE director LIKE 'The ___';
```

이렇게 작성하면 director 컬럼의 값이 'The'로 시작하고 3개의 문자가 있는 데이터만 조회됩니다.

### NOT

NOT 조건은 특정 조건에 해당하지 않는 데이터를 조회할 수 있어요.

```sql
SELECT * FROM movies WHERE director NOT LIKE '%Nolan%';
```

이렇게 작성하면 director 컬럼의 값에 'Nolan'이 포함되지 않은 데이터만 조회됩니다.

## CASE

CASE 문은 조건에 따라 다른 값을 반환하는 명령어에요.

```sql
SELECT title,
CASE WHEN rating >=8 THEN '좋음'
WHEN rating >=5 THEN '보통'
WHEN rating <5 THEN '나쁨'
END AS 영화평점 FROM movies;
```

이렇게 작성하면 rating 컬럼의 값이 8보다 크면 '좋음'을 반환하고 5보다 크고 8보다 작으면 '보통'을 반환하고 그렇지 않으면 '나쁨'을 반환합니다.

## ORDER BY

ORDER BY 문은 조회된 데이터를 정렬하는 명령어에요.

```sql
SELECT * FROM movies ORDER BY rating DESC;
```

이렇게 작성하면 rating 컬럼의 값을 내림차순으로 정렬합니다.

## LIMIT, OFFSET

LIMIT, OFFSET 문은 조회된 데이터의 개수를 제한하는 명령어에요.

```sql
SELECT * FROM movies LIMIT 5;
```

이렇게 작성하면 조회된 데이터의 개수를 5개로 제한합니다.

OFFSET 문은 조회된 데이터의 시작 위치를 지정하는 명령어에요.

```sql
SELECT * FROM movies LIMIT 5 OFFSET 10;
```

이렇게 작성하면 조회된 데이터의 시작 위치를 10으로 지정하고 5개의 데이터를 조회합니다.

쉽게말하면 위 명령문은 처음 10개의 데이터를 건너뛰고 5개의 데이터를 조회한다는 의미에요.

> SQLite 명령문의 실행순서
>
> ```sql
> SELECT -- 3
> FROM -- 1
> WHERE -- 2
> ORDER BY -- 4
> LIMIT -- 6
> OFFSET -- 5
> ```

## GROUP BY

GROUP BY문은 특정 컬럼을 기준으로 데이터를 그룹화하는 명령어에요.

보통 집계함수랑 같이 사용됩니당.

```sql
SELECT director, SUM(revenue) FROM movies GROUP BY director;
```

이런식으로 작성하면 director 컬럼을 기준으로 데이터를 그룹화하고, revenue 컬럼의 값을 합산합니다.

> 🚨 GROUP BY 없이 집계함수를 쓰면 데이터를 그룹화하지 않고 데이터베이스의 모든 데이터에 대해 집계함수를 적용합니다.

## HAVING

HAVING 문은 GROUP BY 문과 함께 사용되며, 그룹화된 데이터에 대한 조건을 지정하는 명령어에요.

```sql
SELECT director, SUM(revenue) FROM movies GROUP BY director HAVING SUM(revenue) > 1000000000;
```

이런식으로 작성하면 revenue 컬럼의 값이 1000000000보다 큰 데이터만 조회됩니다.
