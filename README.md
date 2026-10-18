# 우리WON 뱅킹 (04_springAI)

Spring Boot 로 만든 작은 은행 API 와 React 화면으로 **멱등성 · Spring AI · JWT · 요청 추적 · Actuator · CORS · React 연결**을 3일 동안 익히는 수업용 레포입니다.

- 백엔드: Spring Boot 4.1 · Java 21 · JPA · H2 (메모리 DB), 루트 폴더
- 프론트엔드: React 19 · Vite 8, `frontend/` 폴더
- 시작점은 10/15(목) 이후 수업에서 함께 만든 코드(`wonbanking-backend` main, `511bbcb`)이고, 이 코드가 첫 커밋 **`t0-start`**(Day 0)입니다. 그 위에 **주제별 커밋 6개(태그 `t1` ~ `t6`)** 를 쌓았습니다.

## 실행하기

프로필도 환경변수도 필요 없습니다. H2 메모리 DB 와 데모 데이터가 기본입니다.

```bash
# 터미널 1: 서버 (http://localhost:8080)
./gradlew bootRun

# 터미널 2: 화면 (http://localhost:5173)
cd frontend
npm ci
npm run dev
```

> 화면(`frontend/`)은 아직 가짜(mock) 데이터로 그려집니다. 서버와 연결하는 것은 Day 3 입니다.

### 확인용 주소

| 무엇 | 주소 |
|---|---|
| H2 콘솔 | http://localhost:8080/h2-console (JDBC URL `jdbc:h2:mem:testdb`, 사용자 `sa`, 비밀번호 비움) |
| Swagger UI | http://localhost:8080/swagger-ui/index.html |
| 서버 상태 | http://localhost:8080/actuator/health |

요청 예제는 IntelliJ 의 `src/api.http` 에 모여 있습니다. Postman 을 쓰면 `docs/postman/wonbanking.postman_collection.json` 을 Import 하세요 (Day 0 ~ Day 3 의 요청 55개, 사용법은 Day 0 자료의 "Postman 으로 전체 API 호출하기"). 서버를 다시 시작하면 데이터는 처음 상태로 돌아갑니다.

## 3일 과정과 태그

각 태그가 그날의 **완성본**입니다. 따라가다 막히면 `git switch -c my-t2 t2-ai` 처럼 태그에서 내 브랜치를 만들어 이어가세요.

| 날 | 태그 | 주제 | 자료 |
|---|---|---|---|
| Day 0 | `t0-start` | PUT · PATCH 차이, DELETE(해지 · Soft Delete), 페이징, Header · Body, BigDecimal, `@Transactional`, 비관적 락, JUnit 테스트 (코드 추가 없음, 읽고 실행) | [day0-update-money-tx-lock.md](docs/day0-update-money-tx-lock.md) |
| Day 1 | `t1-idempotency` | 같은 요청을 두 번 보내 보기 (코드 추가 없음, `api.http`) | [day1-idempotency-ai.md](docs/day1-idempotency-ai.md) |
| Day 1 | `t2-ai` | Spring AI 로 거래 메모를 카테고리로 분류, 제공사 전환, AI 저축 도우미(Tool Calling · 프롬프트 파일 · 대화 기억) | [day1-idempotency-ai.md](docs/day1-idempotency-ai.md) |

스레드와 동시성 보충자료(선택)는 [docs/reference/threads.md](docs/reference/threads.md), LAZY · EAGER · N+1 · 순환 참조 참고자료는 [docs/reference/fetch-strategy.md](docs/reference/fetch-strategy.md) 입니다.

## 날마다 시작하기

레포는 처음에 한 번만 받고, 날마다 **그날 시작 태그에서 내 브랜치**를 만들어 실행합니다. 수업자료는 GitHub 의 **main** 에서 읽습니다 (Day 0 자료는 main 에만 있습니다).

### 준비 (수업 전 한 번)

```bash
git clone https://github.com/WONIT-A/04_springAI.git
cd 04_springAI
```

- 필요한 것: JDK 21, IntelliJ, Node.js (Day 3 화면용)
- AI 키는 Day 1 전에 미리 발급해 둡니다. 키가 없어도 앱은 뜨고, AI 부분만 안내 문구가 나옵니다.

### 날마다

```bash
git switch -c my-day0 t0-start          # 그날 시작 태그에서 내 브랜치 만들기 (Day 1 이면 t1-idempotency)
./gradlew bootRun                       # 서버 실행 (H2 메모리 DB, 시드 데이터 자동)
```

- 태그를 바꾼 뒤에는 IntelliJ 에서 **Gradle 새로고침**(코끼리 아이콘)을 합니다. `t2` 에서 AI 의존성이 추가됩니다.
- 수업 중 다음 단계로 넘어갈 때는 내 수정을 커밋한 뒤 `git switch -c my-t2 t2-ai` 처럼 다음 태그로 갈아탑니다. **뒤처졌을 때도 같은 방법으로 바로 따라잡습니다.**

| 날 | 시작 태그 → 끝 태그 | 실행 | 요청 보내기 |
|---|---|---|---|
| Day 0 | `t0-start` (10/15(목) 이후 수업 코드 그대로) | `./gradlew bootRun` | Swagger 또는 Postman 컬렉션 (`src/api.http` 는 `t1` 부터). 토큰 없음 |
| Day 1 | `t1-idempotency` → `t2-ai` | 키 없이: `./gradlew bootRun`<br>키 있으면: IntelliJ 실행 설정의 Active profiles 에 `gemini`, 환경변수에 `GEMINI_API_KEY=...;AI_MODEL=...` | `api.http` 또는 Swagger. 아직 로그인이 없어서 토큰 없이 된다 (데모 고객 1번) |

- AI 키는 **파일에 적지 않고 환경변수로만** 넣습니다 (`application-gemini.yml` 이 `${GEMINI_API_KEY}` 를 읽는다). OpenRouter 는 프로필 `openrouter` + `OPENROUTER_API_KEY`, OpenAI 는 `openai` + `OPENAI_API_KEY`. `.env` 파일은 Spring Boot 가 자동으로 읽지 않습니다.
- Git Bash 로 키와 함께 실행하기: `GEMINI_API_KEY=... AI_MODEL=... ./gradlew bootRun --args='--spring.profiles.active=gemini'`

### 자주 막히는 곳

| 증상 | 원인과 해결 |
|---|---|
| 태그를 바꿨더니 빨간 줄 · import 오류 | Gradle 새로고침을 안 했다 |
| 서버를 다시 켰더니 데이터가 원래대로 | 정상. 메모리 DB 라서 켤 때마다 시드 데이터로 시작한다 |
| `Port 8080 already in use` | 다른 창에서 서버가 이미 실행 중. 그 서버를 끈다 |
| AI 답이 늘 `기타` 나 "쓸 수 없습니다" | 키 · 모델 이름 · 프로필 중 하나가 빠졌다. 콘솔의 WARN 로그에 원인이 나온다 |
| Mac · Linux 에서 `./gradlew` 권한 오류 | `chmod +x gradlew` 한 번 (Windows Git Bash 는 그대로 된다) |
| 내 수정이 있는데 태그를 못 바꾼다 | `git add . && git commit -m "내 실습"` 으로 저장한 뒤 바꾼다 |

## 테스트

```bash
./gradlew test
```

리포트 · AI 도우미는 `ReportFlowTest` 가 확인합니다. Day 0 의 테스트(`AccountTest` 등)는 Day 0 자료 8절에서 다룹니다.

태그별 전체 테스트 수는 `t0` 16 · `t1` 16 · `t2` 22 개입니다. 태그마다 1개(`TestLifeCycle.test3`, `@Disabled`)는 건너뜁니다.

## 일부러 넣지 않은 것

- `Idempotency-Key` 처리: 개념과 H2 `UNIQUE` 실습까지만 하고, 서버 코드로는 만들지 않습니다
- `Transfer` 표와 수수료, Docker, Prometheus · Grafana, MySQL 프로필
