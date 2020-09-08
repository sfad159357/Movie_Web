import React from "react";
import { loadBugs, resolveBug, getUnresolvedBugs } from "../bugs";
import { connect } from "react-redux";

class Bugs extends React.Component {
  componentDidMount() {
    console.log("Bugs CDM");
    this.props.loadBugs(); // 發送完action event後，store內的state就會改變，連帶著props也會改變
  }

  render() {
    console.log("Bugs render");
    return (
      <ul>
        {this.props.unresolvedBugs.map((bug) => (
          // 點擊li元素可以觸發resolveBug(id)，由於發送action command，要透過store.dispatch，要在底下mapDispatchToProps進行設定
          <li key={bug.id}>
            {bug.description}
            <button
              className="m-2 btn btn-primary btn-sm"
              onClick={() => this.props.resolveBug(bug.id)}
            >
              resolve
            </button>
          </li>
        ))}
      </ul>
    );
  }
}
// bugs: state.entities.bugs.list

// 回傳物件，外面加()，將state轉換成props
const mapStateToProps = (state) => ({
  // props : state
  bugs: state.entities.bugs.list,
  unresolvedBugs: getUnresolvedBugs(state),
});

const mapDispatchToProps = (dispatch) => ({
  // props : fn dispatch
  loadBugs: () => {
    dispatch(loadBugs());
  },
  resolveBug: (id) => {
    dispatch(resolveBug(id));
  },
});

// 高級函式，呼叫兩個參數後，再回傳需要帶參數的函式
// 第2參為要subscribe和unsubscribe的元件(Bugs)，presentation component表面元件，因為此元件數據主要都是從背後redux而來的data，只要負責如何呈現就好
// 真正在處理redux的store和dispatch的是背後的ConnectFunction，也就是Container component
export default connect(mapStateToProps, mapDispatchToProps)(Bugs);
