

// 최근 거래 내역 (계좌 1번의 거래만 예시로 담았습니다)
export const transactions = [
  {
    txId: 1,
    accountId: 1,
    txType: "출금",
    amount: 12000,
    balanceAfter: 1511000,
    category: "식비",
    memo: "점심",
    counterparty: "김밥천국",
    txDatetime: "2026-09-02T12:31:00",
  },
  {
    txId: 2,
    accountId: 1,
    txType: "입금",
    amount: 2400000,
    balanceAfter: 3911000,
    category: "급여",
    memo: "9월 급여",
    counterparty: "우리회사",
    txDatetime: "2026-09-01T09:00:00",
  },
  {
    txId: 3,
    accountId: 1,
    txType: "출금",
    amount: 45000,
    balanceAfter: 3866000,
    category: "쇼핑",
    memo: "운동화",
    counterparty: "무신사",
    txDatetime: "2026-08-31T20:14:00",
  },
]


// 2. 함수
// 계좌 잔액을 "1,523,000원" 형태의 문자열로 바꿔주는 함수
export function formatWon(amount) {
  return amount.toLocaleString("ko-KR") + "원"
}

// 계좌번호 앞부분을 가리고 마지막 한 자리만 보여주는 함수
// 예) "1002-345-678901" -> "1002-345-6****1"
export function maskAccountNo(no) {
  return no.slice(0, -5) + "****" + no.slice(-1)
}

// hide 가 true 면 실제 금액 대신 "••••••원" 을 보여줍니다.
export function formatWonMasked(amount, hide) {
  return hide ? "••••••원" : formatWon(amount)
}
