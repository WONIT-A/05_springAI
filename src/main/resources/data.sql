-- 자바코드가 아닌 것들은 resources 폴더에 넣어야 한다.

-- ============================================================================
--  bankdb 씨드 — 9/28 ERD 정규화 수업이 끝난 시점의 상태
-- ============================================================================
-- 이미 DB에 있습니다
--
--  실행:  mysql -u root -p < data.sql
-- ============================================================================

-- DROP DATABASE IF EXISTS bankdb;
-- CREATE DATABASE bankdb DEFAULT CHARSET = utf8mb4;
--USE bankdb;
--
---- ① 고객 — 계좌 3개가 모두 김연지 한 사람 것입니다 (정규화 결과 1행)
--CREATE TABLE customer (
--    customer_id INT AUTO_INCREMENT PRIMARY KEY,
--    name VARCHAR(50) NOT NULL,
--    grade VARCHAR(10),
--    joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
--) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
---- ② 고객 연락처 — 연락처가 몇 개든 행만 늘어납니다
--CREATE TABLE customer_phone (
--    customer_id INT NOT NULL,
--    phone VARCHAR(20) NOT NULL,
--    PRIMARY KEY (customer_id, phone),
--    CONSTRAINT fk_phone_customer FOREIGN KEY (customer_id) REFERENCES customer (customer_id)
--) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
---- ③ 계좌
--CREATE TABLE account (
--    account_id INT AUTO_INCREMENT PRIMARY KEY,
--    customer_id INT NOT NULL,
--    account_no VARCHAR(20) NOT NULL UNIQUE,
--    account_type VARCHAR(10) NOT NULL,
--    balance BIGINT NOT NULL DEFAULT 0,
--    status VARCHAR(10) NOT NULL DEFAULT '정상',
--    opened_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--    CONSTRAINT fk_account_customer FOREIGN KEY (customer_id) REFERENCES customer (customer_id)
--) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
---- ④ 직원
--CREATE TABLE employee (
--    employee_id INT AUTO_INCREMENT PRIMARY KEY,
--    name VARCHAR(50) NOT NULL,
--    duty VARCHAR(10) NOT NULL
--) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
---- ⑤ 계좌담당 — 계좌와 직원을 잇는 연결 표 (N:M)
--CREATE TABLE account_manager (
--    account_id INT NOT NULL,
--    employee_id INT NOT NULL,
--    PRIMARY KEY (account_id, employee_id),
--    CONSTRAINT fk_mgr_account FOREIGN KEY (account_id) REFERENCES account (account_id),
--    CONSTRAINT fk_mgr_employee FOREIGN KEY (employee_id) REFERENCES employee (employee_id)
--) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
---- ⑥ 이체 — 이체 1건을 한 줄로. idempotency_key 는 같은 요청이 두 번 와도 한 번만 처리되게 막는 칸
--CREATE TABLE transfer (
--    transfer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
--    from_account_id INT NOT NULL,
--    to_account_id INT NULL,
--    amount BIGINT NOT NULL,
--    fee BIGINT NOT NULL DEFAULT 0,
--    status VARCHAR(10) NOT NULL,
--    idempotency_key VARCHAR(64) UNIQUE,
--    requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--    CONSTRAINT fk_transfer_from FOREIGN KEY (from_account_id) REFERENCES account (account_id),
--    CONSTRAINT fk_transfer_to FOREIGN KEY (to_account_id) REFERENCES account (account_id)
--) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
---- ⑦ 거래 — 🚨 customer_id 가 없습니다. 거래의 주인은 account 를 거쳐 JOIN 으로 찾습니다

---- ----------------------------------------------------------------------------
----  데이터
---- ----------------------------------------------------------------------------
--INSERT INTO customer (customer_id, name, grade) VALUES (1, '김연지', 'VIP');
--
--INSERT INTO customer_phone (customer_id, phone) VALUES
--    (1, '010-1111-2222'),
--    (1, '02-555-0000');

INSERT INTO account (account_id, customer_id, account_no, account_type, balance, status) VALUES
    (1, 1, '1002-345-678901', '입출금', 1523000, '지급정지'),
    (2, 1, '1002-345-112233', '적금',   1099500, '정상'),
    (3, 1, '1002-345-998877', '적금',    497000, '휴면');
ALTER TABLE account ALTER COLUMN account_id RESTART WITH 4;
--INSERT INTO employee (employee_id, name, duty) VALUES
--    (1, '박지훈', '수신'),
--    (2, '이서연', '여신');
--
--INSERT INTO account_manager (account_id, employee_id) VALUES (1, 1), (2, 1), (3, 2);
--
---- 9/28 STEP 13 의 이체 실습 1건 (2번 계좌 → 3번 계좌, 100,000원, 수수료 500원)
--INSERT INTO transfer (transfer_id, from_account_id, to_account_id, amount, fee, status, idempotency_key, requested_at)
--VALUES (1, 2, 3, 100000, 500, '완료', 'demo-transfer-0928-01', '2026-09-20 14:00:00');
--
---- 거래 7건. 1번 계좌의 balance_after 는 "화면(React)에 찍혀 있던 값을 그대로 옮긴 것"이라
---- 서로 맞지 않습니다 — 일부러 그렇게 만든 비정규화 사고 현장입니다. 고치지 마세요.
INSERT INTO `transaction`
(account_id, transfer_id, tx_type, amount, balance_after, category, memo, counterparty, tx_datetime) VALUES
                                                                                                         (1, NULL, '입금', 2400000, 3900000, '급여', '8월 급여', '우리회사', '2026-08-01 09:00:00'),
                                                                                                         (1, NULL, '출금', 700000, 3200000, '기타', '8월 월세', '집주인', '2026-08-02 10:00:00'),
                                                                                                         (1, NULL, '출금', 1500, 3198500, '교통', '출근 지하철', '서울교통공사', '2026-08-03 08:10:00'),
                                                                                                         (1, NULL, '출금', 11500, 3187000, '식비', '회사 근처 점심', '김밥천국', '2026-08-03 12:30:00'),
                                                                                                         (1, NULL, '출금', 4500, 3182500, '식비', '출근길 커피', '스타벅스', '2026-08-04 08:40:00'),
                                                                                                         (1, NULL, '출금', 300000, 2882500, '저축', '8월 적금 납입', '본인', '2026-08-05 10:00:00'),
                                                                                                         (1, NULL, '출금', 42000, 2840500, '식비', '주말 장보기', '이마트', '2026-08-06 17:40:00'),
                                                                                                         (1, NULL, '출금', 35000, 2805500, '식비', '친구와 저녁', '성수동식당', '2026-08-07 19:10:00'),
                                                                                                         (1, NULL, '출금', 2900, 2802600, '교통', '버스·지하철', '티머니', '2026-08-08 13:20:00'),
                                                                                                         (1, NULL, '출금', 14900, 2787700, '기타', '음악 스트리밍', '멜론', '2026-08-09 07:00:00'),
                                                                                                         (1, NULL, '출금', 22000, 2765700, '식비', '야근 저녁 배달', '배달의민족', '2026-08-11 20:15:00'),
                                                                                                         (1, NULL, '출금', 38500, 2727200, '쇼핑', '기초 화장품', '올리브영', '2026-08-12 19:30:00'),
                                                                                                         (1, NULL, '출금', 12000, 2715200, '식비', '회사 근처 점심', '한솥도시락', '2026-08-14 12:25:00'),
                                                                                                         (1, NULL, '입금', 100000, 2815200, '기타', '주말 디자인 외주', '외주플랫폼', '2026-08-15 18:00:00'),
                                                                                                         (1, NULL, '출금', 52000, 2763200, '식비', '친구 생일 저녁', '을지로식당', '2026-08-16 19:00:00'),
                                                                                                         (1, NULL, '출금', 59000, 2704200, '기타', '헬스장 월 이용료', '동네헬스장', '2026-08-18 08:00:00'),
                                                                                                         (1, NULL, '출금', 32000, 2672200, '기타', '전기·가스 요금', '관리사무소', '2026-08-20 10:00:00'),
                                                                                                         (1, NULL, '출금', 79000, 2593200, '쇼핑', '운동화', '무신사', '2026-08-22 14:20:00'),
                                                                                                         (1, NULL, '출금', 35500, 2557700, '식비', '주말 식재료 장보기', '홈플러스', '2026-08-23 17:40:00'),
                                                                                                         (1, NULL, '출금', 18700, 2539000, '교통', '퇴근 택시', '카카오T', '2026-08-25 22:10:00'),
                                                                                                         (1, NULL, '출금', 28000, 2511000, '기타', '영화 관람', '롯데시네마', '2026-08-29 16:30:00'),
                                                                                                         (1, NULL, '출금', 24700, 2486300, '식비', '저녁 배달', '배달의민족', '2026-08-30 19:50:00'),
                                                                                                         (1, NULL, '출금', 78000, 2408300, '기타', '실손·건강보험료', '보험사', '2026-08-31 09:00:00'),
                                                                                                         (1, NULL, '입금', 2400000, 4808300, '급여', '9월 급여', '우리회사', '2026-09-01 09:00:00'),
                                                                                                         (1, NULL, '출금', 700000, 4108300, '기타', '9월 월세', '집주인', '2026-09-02 10:00:00'),
                                                                                                         (1, NULL, '출금', 1500, 4106800, '교통', '출근 지하철', '서울교통공사', '2026-09-03 08:10:00'),
                                                                                                         (1, NULL, '출금', 13000, 4093800, '식비', '회사 근처 점심', '샐러디', '2026-09-03 12:15:00'),
                                                                                                         (1, NULL, '출금', 4800, 4089000, '식비', '출근길 커피', '스타벅스', '2026-09-04 08:40:00'),
                                                                                                         (1, NULL, '출금', 300000, 3789000, '저축', '9월 적금 납입', '본인', '2026-09-05 10:00:00'),
                                                                                                         (1, NULL, '출금', 42600, 3746400, '식비', '주말 장보기', '이마트', '2026-09-05 18:20:00'),
                                                                                                         (1, NULL, '출금', 48000, 3698400, '식비', '친구와 저녁', '을지로식당', '2026-09-06 19:10:00'),
                                                                                                         (1, NULL, '출금', 2900, 3695500, '교통', '버스·지하철', '티머니', '2026-09-07 08:20:00'),
                                                                                                         (1, NULL, '출금', 14900, 3680600, '기타', '음악 스트리밍', '멜론', '2026-09-08 07:00:00'),
                                                                                                         (1, NULL, '출금', 23500, 3657100, '식비', '야근 저녁 배달', '배달의민족', '2026-09-09 20:15:00'),
                                                                                                         (1, NULL, '출금', 46000, 3611100, '쇼핑', '기초 화장품', '올리브영', '2026-09-10 19:30:00'),
                                                                                                         (1, NULL, '출금', 12500, 3598600, '식비', '회사 근처 점심', '한솥도시락', '2026-09-11 12:25:00'),
                                                                                                         (1, NULL, '출금', 6200, 3592400, '식비', '카페 음료', '컴포즈커피', '2026-09-12 15:40:00'),
                                                                                                         (1, NULL, '출금', 65000, 3527400, '식비', '친구 생일 저녁', '성수동식당', '2026-09-13 19:00:00'),
                                                                                                         (1, NULL, '출금', 3000, 3524400, '교통', '주말 지하철', '티머니', '2026-09-14 13:10:00'),
                                                                                                         (1, NULL, '출금', 55000, 3469400, '기타', '휴대전화 요금', '통신사', '2026-09-15 09:00:00'),
                                                                                                         (1, NULL, '출금', 38700, 3430700, '식비', '저녁 장보기', '홈플러스', '2026-09-16 18:45:00'),
                                                                                                         (1, NULL, '출금', 11000, 3419700, '식비', '회사 근처 점심', '백반집', '2026-09-17 12:20:00'),
                                                                                                         (1, NULL, '입금', 120000, 3539700, '기타', '주말 디자인 외주', '외주플랫폼', '2026-09-17 20:00:00'),
                                                                                                         (1, NULL, '출금', 18700, 3521000, '교통', '퇴근 택시', '카카오T', '2026-09-18 22:10:00'),
                                                                                                         (1, NULL, '출금', 31000, 3490000, '기타', '영화 관람', '롯데시네마', '2026-09-19 16:30:00'),
                                                                                                         (1, NULL, '출금', 89000, 3401000, '쇼핑', '가을 셔츠', '무신사', '2026-09-20 14:20:00'),
                                                                                                         (1, NULL, '출금', 10500, 3390500, '식비', '회사 근처 점심', '편의점', '2026-09-21 12:35:00'),
                                                                                                         (1, NULL, '출금', 59000, 3331500, '기타', '헬스장 월 이용료', '동네헬스장', '2026-09-22 08:00:00'),
                                                                                                         (1, NULL, '출금', 5200, 3326300, '식비', '출근길 커피', '메가커피', '2026-09-23 08:30:00'),
                                                                                                         (1, NULL, '출금', 32400, 3293900, '기타', '전기·가스 요금', '관리사무소', '2026-09-24 10:00:00'),
                                                                                                         (1, NULL, '출금', 27000, 3266900, '식비', '동료와 저녁', '식당', '2026-09-25 19:20:00'),
                                                                                                         (1, NULL, '출금', 66000, 3200900, '쇼핑', '미용실 커트', '동네미용실', '2026-09-26 15:00:00'),
                                                                                                         (1, NULL, '출금', 2900, 3198000, '교통', '버스·지하철', '티머니', '2026-09-27 11:30:00'),
                                                                                                         (1, NULL, '출금', 35800, 3162200, '식비', '주말 식재료 장보기', '이마트', '2026-09-28 17:40:00'),
                                                                                                         (1, NULL, '출금', 26000, 3136200, '식비', '저녁 배달', '배달의민족', '2026-09-29 19:50:00'),
                                                                                                         (1, NULL, '출금', 78000, 3058200, '기타', '실손·건강보험료', '보험사', '2026-09-30 09:00:00');
---- ----------------------------------------------------------------------------
----  확인 ① 행 수 — 고객 1 / 연락처 2 / 계좌 3 / 직원 2 / 계좌담당 3 / 이체 1 / 거래 7
---- ----------------------------------------------------------------------------
--SELECT (SELECT COUNT(*) FROM customer)        AS 고객,
--       (SELECT COUNT(*) FROM customer_phone)  AS 연락처,
--       (SELECT COUNT(*) FROM account)         AS 계좌,
--       (SELECT COUNT(*) FROM employee)        AS 직원,
--       (SELECT COUNT(*) FROM account_manager) AS 계좌담당,
--       (SELECT COUNT(*) FROM transfer)        AS 이체,
--       (SELECT COUNT(*) FROM `transaction`)   AS 거래;
--
---- ----------------------------------------------------------------------------
----  확인 ② 대사 — 저장된 잔액 = 가장 최근 거래의 balance_after 인가?
----  1번만 12,000원 차이가 나야 정상입니다 (9/28 STEP 13-6 과 같은 쿼리)
---- ----------------------------------------------------------------------------
--SELECT a.account_id, a.account_no, a.balance AS 저장된_잔액,
--       (SELECT t.balance_after FROM `transaction` t
--         WHERE t.account_id = a.account_id
--         ORDER BY t.tx_datetime DESC, t.tx_id DESC LIMIT 1) AS 최신거래_잔액,
--       a.balance - (SELECT t.balance_after FROM `transaction` t
--         WHERE t.account_id = a.account_id
--         ORDER BY t.tx_datetime DESC, t.tx_id DESC LIMIT 1) AS 차이
--FROM account a ORDER BY a.account_id;
--
---- ----------------------------------------------------------------------------
----  확인 ③ 카테고리별 출금 합계 — 이체 100,500 / 쇼핑 45,000 / 식비 12,000
---- ----------------------------------------------------------------------------
--SELECT category, SUM(amount) AS 합계
--FROM `transaction` WHERE tx_type = '출금'
--GROUP BY category ORDER BY 합계 DESC;
