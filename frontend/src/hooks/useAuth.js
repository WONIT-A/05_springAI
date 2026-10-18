// src/hooks/useAuth.js : 훅만 export 한다
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext.js";

// 어디서든 꺼내 쓰기 — props 로 내려 주지 않아도 된다
export function useAuth() {
  return useContext(AuthContext);     // { user, login, logout }
}
