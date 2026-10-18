// src/contexts/authContext.js  (파일 이름의 대소문자만 다른 AuthContext.jsx 와 헷갈리지 않게 주의!)
// Context 객체(createContext)만 담는다. Provider 컴포넌트와 같은 파일에 두면
// Fast Refresh 규칙(react-refresh/only-export-components) 에러가 난다
import { createContext } from "react";

export const AuthContext = createContext(null);   // null = 아직 Provider 밖
