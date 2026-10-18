// components/TransferForm.jsx
import { useState } from "react"

// 이체 폼 컴포넌트. 하나의 state 객체(form)로 입력값 세 개를
// 한꺼번에 관리하고, handleChange 하나로 세 input 을 모두 처리합니다.
// onTransfer 라는 함수를 부모 컴포넌트에서 props로 전달받습니다. (함수도 코드조각이니까)
function TransferForm({ fromAccount, onTransfer }) {
  const [form, setForm] = useState({ toAccount: "", amount: "", memo: "" })

  // 실제 서버가 없어 이체 처리가 사실상 즉시 끝나지만, 버튼을 연타해서
  // 이체가 중복으로 나가는 상황을 막기 위해 "전송 중"이라는 상태를
  // 따로 둡니다. 서버와 통신하는 실전 코드에서는 이 sending 이 응답이
  // 돌아올 때까지 true 로 유지되면서 버튼을 계속 잠궈줍니다.
  const [sending, setSending] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target

    if (name === "amount") {
      // 숫자만 남기고 나머지 문자는 모두 지웁니다.
      setForm({ ...form, amount: value.replace(/[^0-9]/g, "") })
      return
    }

    setForm({ ...form, [name]: value })
  }

  // 입력값이 하나도 없는 처음 화면에서는 에러 문구를 보여주지 않습니다.
  const touched = form.toAccount !== "" || form.amount !== "" || form.memo !== ""

  let errorMessage = ""
  if (form.toAccount.trim() === "") {
    errorMessage = "받는 계좌를 입력하세요"
  } else if (Number(form.amount) <= 0) {
    errorMessage = "금액을 입력하세요"
  } else if (Number(form.amount) > fromAccount.balance) {
    errorMessage = "잔액이 부족합니다"
  }

  function handleSubmit(e) {
    e.preventDefault() // 화면의 새로고침을 방지하는 역할
    // HTML의 <form> 태그는 submit 이벤트가 발생할 때 
    // 데이터를 특정 주소로 전송하면서 
    // 브라우저 페이지 전체를 새로고침(Hard Refresh)하는 동작이 기본입니다.
		// React는 화면 전체를 다시 불러오지 않고 필요한 부분만 업데이트하는 SPA(Single Page Application)입니다.
		// 만약 브라우저가 폼 제출 시 페이지를 새로고침해 버리면,
		// React 앱이 처음부터 다시 로드되면서 지금까지 메모리에 저장해 둔 
		// 모든 state(입력 중인 데이터, 로그인 상태 등)가 전부 초기화됩니다.
		// 브라우저의 기본 값인 새로고침 동작을 강제로 막고, 
		// 오직 React의 JavaScript 로직 안에서만 데이터를 안전하게 처리하기 위해 
		// e.preventDefault()를 사용합니다.
    setSending(true)

    onTransfer({
      toAccount: form.toAccount,
      amount: Number(form.amount),
      memo: form.memo,
    })

    setForm({ toAccount: "", amount: "", memo: "" })
    setSending(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label>받는 계좌</label>
        <input
          type="text"
          name="toAccount"
          value={form.toAccount}
          onChange={handleChange}
          placeholder="계좌번호 또는 이름"
        />
      </div>

      <div className="field">
        <label>보낼 금액</label>
        <input
          type="text"
          name="amount"
          value={form.amount === "" ? "" : Number(form.amount).toLocaleString("ko-KR")}
          onChange={handleChange}
          placeholder="0"
          inputMode="numeric"
        />
      </div>

      <div className="field">
        <label>메모 (선택)</label>
        <input
          type="text"
          name="memo"
          value={form.memo}
          onChange={handleChange}
          placeholder="예) 용돈"
        />
      </div>

      {touched && errorMessage !== "" && <p className="error">{errorMessage}</p>}

      <button className="btn" type="submit" disabled={sending || errorMessage !== ""}>
        {sending ? "이체 중..." : "이체"}
      </button>
    </form>
  )
}

export default TransferForm
