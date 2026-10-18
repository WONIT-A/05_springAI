// src/hooks/useFetch.js
import { useState, useEffect } from "react";

// 외부에서 데이터를 불러올 때 성공/실패/로딩중 화면을 만드는 작업을
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let alive = true;             // 정리용 flag
    // (lint 수정) 여기 있던 setLoading(true); setError(null); 은 지웠다.
    // effect 안에서 곧바로 setState 를 부르면 화면이 불필요하게 한 번 더 그려진다 (react-hooks/set-state-in-effect).
    // 처음에는 어차피 로딩 중이라 loading 의 처음값이 true 이고, "다시 시도" 때의 초기화는 아래 reload 가 맡는다

    // asynchrous  비동기로 특정 함수를 실행하기 위한 키워드
    async function load() {
      try {
        const result = await fetcher();
        if (alive) setData(result);
      } catch (e) {
        if (alive) setError(e);          // 메시지 문자열이 아니라 에러 객체째로 (code · requestId 를 화면에서 쓰기 위해). 메시지는 error.message
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();

    return () => { alive = false;  }; 
  }, [reloadKey, ...deps]); // dependency(의존) 해당 state가 변경될 때마다 새로 컴포넌트가 엘리먼트를 찍어내도록 걸어주는 변수

  // "다시 시도" 를 누르는 순간 화면을 로딩 상태로 되돌린다 (이벤트 핸들러 안의 setState 는 괜찮다)
  const reload = () => {
    setLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  };
  return { data, loading, error, reload };
}