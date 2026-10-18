import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // 중복되는 값이 있으면 import 순서에 좌우됩니다.
import App from './App.jsx'

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// // main.jsx 에서 1초마다 다시 그리기
// setInterval(() => {
//   root.render(<App />);
// }, 1000);
