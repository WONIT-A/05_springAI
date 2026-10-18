// src/contexts/UserContext.jsx
import { createContext, useContext } from "react";

const UserContext = createContext(null); // 초기값

export function UserProvider({ user, children }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}


// 어디서든 꺼내기 — props 없이


