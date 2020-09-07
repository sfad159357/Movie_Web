import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadBugs, resolveBug, getUnresolvedBugs } from "../store/bugs";

// Hook，useXXX只適用在"functional component"
// 只要state.entities.bugs.list改變，useSelector就會去運算，然後回傳新的值
export default function BugsHook() {
  const dispatch = useDispatch();
  // 參數是state，回傳bugs.list
  // const bugs = useSelector((state) => state.entities.bugs.list);
  // 也可以直接將有createSelector的函式直接當作參數，回傳參數函式運算後的陣列
  const unresolvedBugs = useSelector(getUnresolvedBugs);

  // Hook，每render過後useEffect就會被呼叫一次，取代CDM,CDU生命週期
  useEffect(() => {
    dispatch(loadBugs());
  }, [dispatch]);
  // []陣列內的物件元素是此useEffect()的依賴，也就是當陣列內物件有任何的改變，此useEffect()就會被呼叫
  // []但這裡是空陣列，也就沒有任何依賴，只被呼叫一次。如果不輸入空陣列，則每render一次就會呼叫一次
  // 本來是[]空陣列，加了dispatch依賴，是因為console出現warning要我加上去
  return (
    // unresolvedBugs因為useSelector偵測到state.entities.bugs.list跟上次不同而更新回傳值，這就觸發到return
    <ul>
      {unresolvedBugs.map((bug) => (
        <li key={bug.id}>
          {bug.description}
          <button
            className="m-2 btn btn-primary btn-sm"
            onClick={() => dispatch(resolveBug(bug.id))}
          >
            resolve
          </button>
        </li>
      ))}
    </ul>
  );
}
