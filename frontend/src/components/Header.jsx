import { useUser } from '../contexts/UserContext.jsx'

// StatusBadge에서 사용하는 status를 prop-drilling 없이 Context로 전달
// AccountCard에 user.name의 계좌라는 글자를 삽입 
// 45분까지 
function Header() {
    const user = useUser();
    
    return (
            <h1>{user.name}님, 안녕하세요</h1>
        )
}

export default Header;