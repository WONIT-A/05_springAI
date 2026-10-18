// 계좌 상태에 따라 배지 색을 바꿀 겁니다.
import { useUser } from "../contexts/UserContext.jsx";


const colors = {
    "정상" : "#036c03",
    "휴면" : "#858685",
    "지급정지" : "#fc0808",
    "해지" : "#1f1f1f"
}

// inline(코드 사이에 css를 입힐 때): style={{ key: value }} 형식으로 삽입합니다.
function StatusBadge({ }){

    // UserContext에서 현재 계좌의 status를 가져옵니다.
    const user = useUser();
    const status = user.status;

    return (
        <span className="badge" style={{ backgroundColor : colors[status] }}>
            {status}
        </span>
    )
} 

export default StatusBadge