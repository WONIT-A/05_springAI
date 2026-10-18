// 제목이 있는 섹션(패널)을 구분하는 컴포넌트
import { useUser } from '../contexts/UserContext.jsx'

// components/Panel.jsx
function Panel({ title, children }) {

  const user = useUser();

  return (
    <section className="panel">
      {/* 중앙방송 중이라 모든 panel에 전달됨 */}
      <h2>{ title === '내 계좌' ? `${user.name}의 계좌` : title } </h2>
      {children}
    </section>
  );
}

export default Panel;