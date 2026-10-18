import { useState } from 'react'
import TransactionRow from './TransactionRow'
import { fetchTransactions } from '../api/exchange'
import { useFetch } from '../hooks/useFetch.js'
import { formatWon } from '../utils/format.js'

const TYPE_OPTIONS = ["전체", "입금", "출금"]

const CATEGORY_OPTIONS = [
  "전체",
  "식비",
  "교통",
  "쇼핑",
  "급여",
  "이체",
  "의료",
  "통신",
]
function TransactionList({ transactions, showAmount }) {
  // data 변수에 transcations [{ }, { }] 전체 리턴받음 
  // const { data, loading, error, reload } = useFetch(fetchTransactions); // 함수 안에서 불러서 사용하는 함수를 CallBack
  const [typeFilter, setTypeFilter] = useState("전체")
  const [categoryFilter, setCategoryFilter] = useState("전체")

  // if (loading) return <p className="muted">거래내역을 불러오는 중...</p>;
  // if (error) return <button className="btn" onClick={reload}>다시 시도</button>;
 
  // const transactions = data 
  const visibleTransactions = transactions.filter((tx) => {
    const matchesType =
      typeFilter === "전체" || tx.txType === typeFilter

    const matchesCategory =
      categoryFilter === "전체" || tx.category === categoryFilter

    return matchesType && matchesCategory
  })

  const totalAmount = Math.abs(
    visibleTransactions.reduce((total, tx) => {
      const signedAmount =
        tx.txType === "입금" ? tx.amount : -tx.amount

      return total + signedAmount
    }, 0)
  )

  return (
    <>
      <div className="chips">
        {TYPE_OPTIONS.map((type) => (
          <button
            key={type}
            className={`chip ${typeFilter === type ? "on" : ""}`}
            onClick={() => setTypeFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="chips">
        {CATEGORY_OPTIONS.map((category) => (
          <button
            key={category}
            className={`chip ${categoryFilter === category ? "on" : ""}`}
            onClick={() => setCategoryFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="summary">
        총 {visibleTransactions.length}건 · 합계 {formatWon(totalAmount)}
      </div>

      {visibleTransactions.map((tx) => (
        <TransactionRow
          key={tx.txId}
          {...tx}
          hideAmount={showAmount}
        />
      ))}
    </>
  )
}

export default TransactionList
