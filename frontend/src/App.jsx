// 필요한 부품들을 불러옵니다.
import './App.css'
import Clock from './components/Clock.jsx'
import Panel from './components/Panel.jsx'
import AccountCard  from './components/AccountCard.jsx'
import Header from './components/Header'
import Counter from './components/Counter.jsx'
import { useState } from 'react'
import TransactionRow from './components/TransactionRow.jsx'
import { transactions as initialTransactions } from './data/mockData'
import { formatWon } from './utils/format.js'
import ExchangeRate from './components/ExchangeRate.jsx'
import TransactionList from './components/TransactionList.jsx'
import { UserProvider } from './contexts/UserContext.jsx'
import TransferForm from './components/TransferForm.jsx' // 추가

// 02_html기초.html 안에 만들었던 계좌카드의 css를 가져와서
// 아래에 있는 카드를 좀더 그럴듯하게 꾸며보세요.
// 실제로 사용될 화면을 그립니다.
function App() {
  
  // 화면이 렌더링 되기 위해 필요로 하는 값(data)을 적습니다.
  // 1. 데이터
  // 계좌 목록 (실제 서비스에서는 백엔드 DB에서 내려오는 데이터가 뿌려집니다)
  const initialAccounts = [
    {
      accountId: 'a', // 중복을 구분하기 위해서 화면에 뿌리지 않아도 구분자역할을 하는 id값을 데이터에 심어주게 됩니다.
      accountNo: "1002-345-678901", // 
      accountType: "입출금", // 
      balance: 1523000, // 
      status: "지급정지", //
      ownerName: "김연지", // 
    },
    {
      accountId: 'b', 
      accountNo: "1002-345-112233",
      accountType: "적금",
      balance: 1200000,
      status: "정상",
      ownerName: "김연지",
    },
    {
      accountId: 'c',
      accountNo: "1002-345-998877",
      accountType: "적금",
      balance: 397000,
      status: "휴면",
      ownerName: "김연지",
    },
  ]

  // flag 변수: 깃발을 들어서 교통량을 제어하는 것처럼 이 변수의 역할은 특정 로직을 끄거나 켜거나 밖에 없기 때문에
  // flag 변수를 사용할 때는 default 값을 false로 만들고 시작하는 로직을 권장 
  const [showFullNo, setShowFullNo] = useState(false);
  //     ↑현재 값      ↑바꾸는 함수              ↑처음값

  // 실습!
  // showAmount 버튼의 클릭 여부에 따라 AccoutCard의 금액이 보이거나 보이지 않도록 
  // prop으로 새로 생긴 변수를 넘겨보세요
  const [showAmount, setShowAmount] = useState(false);

  // 고객에 관한 전체 정보를 한 번 불러와서 state로 관리
  const [accounts, setAccounts] = useState(initialAccounts);

  	// 추가: 이 state 가 바뀌고, 그 값을 props 로 받는 TransactionList가 그려집니다
  const [transactions, setTransactions] = useState(initialTransactions);

  // accounts의 특정 위치의 balance를 변경하는 함수
  // accountId라는 고유key로 특정 고객의 balance를 변경
  // 입력받은 accountId가 일치하는 고객의 계좌 dict에서만
  // map 함수를 가지고 특정 dict의 모든 값-value에 접근해서
  // balance 라는 key에만 10000을 더합니다.
  function handleDeposit(accountId) {
    setAccounts(
      accounts.map((a) => 
        a.accountId === accountId ? {...a, balance: a.balance + 10000} : a)
    )
  }

   // 추가: 이체 폼(TransferForm)에서 이체 버튼을 누르면 이 함수가 실행됩니다.
  // 계좌 잔액과 거래내역, 이 두 state 를 한 번에 갱신하는 것이 이번 세션의 핵심입니다.
  function handleTransfer({ toAccount, amount, memo }) {
    const from = accounts[0]
    const nextBalance = from.balance - amount

    setAccounts((prev) =>
      prev.map((a) =>
        a.accountId === from.accountId ? { ...a, balance: nextBalance } : a
      )
    )

    setTransactions((prev) => [
      {
        txId: Date.now(),  // 현재 시간 UNIXTIME으로 timestamp
        accountId: from.accountId,
        txType: "출금",
        amount,
        balanceAfter: nextBalance,
        category: "이체",
        memo: memo || "이체",
        counterparty: toAccount,
        txDatetime: new Date().toISOString().slice(0, 19),
      },
      ...prev, // 새 거래를 맨 앞에
    ])
  }

  // 합계를 state로 두지 않습니다. component 안에서의 각각의 상태값이 아니고
  // App에서 매번 다시 계산하는 변수
  const totalBalance = accounts[0].balance + accounts[1].balance + accounts[2].balance

  // XML에서는 여는 꺽쇠 안의 태그가 무엇이든 될 수 있기 때문에 <이름>김연지 </이름>
  // JSX 가 소문자 태그는 HTML, 대문자로 시작하는 태그는 컴포넌트로 인식
  // return ( ) 바깥에서는 일반 자바스크립트처럼 // 로 주석을 적습니다.
  // return 뒤에 렌더링 될 부분을 적습니다.
  return (
    <> 
    <UserProvider user={{ name: "김연지", grade: "우수" }}>    
    <Header />

    <button onClick={() => setShowFullNo(!showFullNo)}>
      {/* 논리연산자를 사용해서 같은 화면을 조건부 렌더링해보세요 */}
      {/* showFullNo ? "계좌번호 숨기기" : "계좌번호 보기" */}
      {showFullNo && "계좌번호 숨기기"}
      {!showFullNo && "계좌번호 보기"}
    </button>

    <button onClick={() => setShowAmount(!showAmount)}>
      {showAmount ? "금액 숨기기" : "금액 보기"}
    </button>
    
    <Clock />
    {/* class 는 JS의 예약어이므로 JSX에서는 className으로 대신 사용합니다.*/}

    {/* 추가 */}
    <Panel title="이체">
      <TransferForm fromAccount={accounts[0]} onTransfer={handleTransfer} />
    </Panel>
     
    <div className="total">
      <p> 총 자산 </p>
      <p> {formatWon(totalBalance) } </p>
    </div>
    {/* 사용 */}

    <Panel title={'내 계좌'}>
      {accounts.map((account) => (
        // 계좌마다 UserProvider를 만들어
        // 해당 계좌의 status를 Context로 전달합니다.
        <UserProvider
          key={account.accountId}
          user={{
            name: "김연지",
            grade: "우수",
            status: account.status,
          }}
        >
          <AccountCard key={account.accountId} 
                      showFullNo={showFullNo}
                      showAmount={showAmount}
                      onDeposit={() => handleDeposit(account.accountId)} 
                      accountNo={account.accountNo}
                      accountType={account.accountType} 
                      balance={account.balance}
                       />
        </UserProvider>
        ))}
    </Panel>

    {/* map()과 key, spread연산자로 가지고 있는 집합자료형의 모든 자료를 화면에 
    반복해서 돌면서 풀어헤칩니다.
    1. spread 연산자로 전체 key/value를 퉁쳐버리면 props 에 처음에 받았던 값들만 사용합니다.
    2. 어디에 무슨 변수가 들어가는지 확인이 불가합니다.  
    txType, amount, category, memo, counterparty, txDatetime, hideAmount  */}

    <Panel title="최근 거래">
      <TransactionList transactions={transactions} showAmount={showAmount} />
    </Panel>

    <Panel title="오늘의 환율"> 
     <ExchangeRate />
    </Panel>
    </UserProvider>
    </>
  );
}

// 이 컴포넌트를 외부에서 import해서 쓸 수 있도록 선언
export default App
