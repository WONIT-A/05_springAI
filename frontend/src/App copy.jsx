// 필요한 부품들을 불러옵니다.
import './App.css'
// 02_html기초.html 안에 만들었던 계좌카드의 css를 가져와서
// 아래에 있는 카드를 좀더 그럴듯하게 꾸며보세요.
// 동작
// 2. 함수
// 계좌 잔액을 "1,523,000원" 형태의 문자열로 바꿔주는 함수
function formatWon(amount) {
  return amount.toLocaleString("ko-KR") + "원"
}

// 계좌번호 앞부분을 가리고 마지막 한 자리만 보여주는 함수
// 예) "1002-345-678901" -> "1002-345-6****1"
function maskAccountNo(no) {
  return no.slice(0, -5) + "****" + no.slice(-1)
}

// hide 가 true 면 실제 금액 대신 "••••••원" 을 보여줍니다.
function formatWonMasked(amount, hide) {
  return hide ? "••••••원" : formatWon(amount)
}

// 일반 함수와 구분해서 JSX에서 이해하도록 
// 컴포넌트 명은 대문자로 시작하는 파스칼케이스를 따릅니다.
function Clock() {
  const now = new Date();
  return <span>{now.toLocaleTimeString("ko-KR")}</span>;
}


// 실제로 사용될 화면을 그립니다.
function App() {
  
  // 화면이 렌더링 되기 위해 필요로 하는 값(data)을 적습니다.
  // 1. 데이터
  // 계좌 목록 (실제 서비스에서는 백엔드 DB에서 내려오는 데이터가 뿌려집니다)
  const accounts = [
    {
      accountId: 1,
      accountNo: "1002-345-678901", // 
      accountType: "입출금", // 
      balance: 1523000, // 
      status: "정상",
      ownerName: "김연지", // 
    },
    {
      accountId: 2,
      accountNo: "1002-345-112233",
      accountType: "적금",
      balance: 1200000,
      status: "정상",
      ownerName: "김연지",
    },
    {
      accountId: 3,
      accountNo: "1002-345-998877",
      accountType: "적금",
      balance: 397000,
      status: "휴면",
      ownerName: "김연지",
    },
  ]

  // flag 변수: 깃발을 들어서 교통량을 제어하는 것처럼 이 변수의 역할은 특정 로직을 끄거나 켜거나 밖에 없기 때문에
  // flag 변수를 사용할 때는 default 값을 false로 만들고 시작하는 로직을 권장 
  let showFullNo = true
  
  // XML에서는 여는 꺽쇠 안의 태그가 무엇이든 될 수 있기 때문에 <이름>김연지 </이름>
  // JSX 가 소문자 태그는 HTML, 대문자로 시작하는 태그는 컴포넌트로 인식
  // return ( ) 바깥에서는 일반 자바스크립트처럼 // 로 주석을 적습니다.
  // return 뒤에 렌더링 될 부분을 적습니다.
  return (
    <> 
    <Clock />
    {/* class 는 JS의 예약어이므로 JSX에서는 className으로 대신 사용합니다.*/}
    <div className="card">
      <p>{accounts[0].ownerName}님의 {accounts[0].accountType}</p>
      {/* 계좌번호를 가려서 출력 */}
      <p>{maskAccountNo(accounts[0].accountNo)} </p> 
      {/* 실제 서비스에서는 민감정보들을 화면에 직접 출력하지 않습니다. */}
      <p>{ formatWonMasked(accounts[0].balance, showFullNo) }</p>
    </div>
    </>
  );
}

export default App
