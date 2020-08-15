import React, { Component } from "react";

class Counter extends Component {
  // constructor(props) {
  //   super(props); // 不管有沒有繼承屬性或方法，都要先問你老爸！
  // console.log(this); // 建立建構子後，this為Counter物件
  // this.handleIncr = this.handleIncr.bind(this) // 此種方法this.handleIncr內的this就被綁定為Counter
  // }
  componentDidUpdate(prevProps, prevState) {
    console.log("prevProps", prevProps);
    console.log("thisProps", this.props);
    if (prevProps.counter.value === this.props.counter.value) {
      console.log("這沒屁用！");
    }
  }

  render() {
    console.log("Counter元件render");
    // React.createElement('h1')
    // 在import React下會直接預設，才能將jsx會被編譯成React element，本質上就時原生javascript
    // React.createElement()只能包覆一個html標籤，所以所有標籤必須背包在parent element，也就是div

    const { onAdd2, onDecr2, onDelete2, counter } = this.props;

    // jsx寫法，不是string
    return (
      <div className="row ">
        <div className="col-1">
          <span style={{ fontSize: 15 }} className={this.getBadgeClasses()}>
            {this.formatCount()}
          </span>
        </div>
        <div className="col">
          <button
            onClick={() => onAdd2(counter)}
            // style={{ fontSize: 20 }}
            className="btn btn-secondary ml-4 btn-sm"
          >
            +
          </button>
          <button
            onClick={() => onDecr2(counter)}
            // style={{ fontSize: 20 }}
            className="btn btn-secondary m-2 btn-sm"
            disabled={counter.value === 0 ? "disabled" : 0}
          >
            -
          </button>
          <button
            className="btn btn-danger btn-sm "
            // style={{ fontSize: 20 }}
            onClick={onDelete2}
          >
            X
          </button>
        </div>
      </div>
    );
  }

  getBadgeClasses() {
    let classes = "badge m-2 badge-";
    classes += this.props.counter.value === 0 ? "warning" : "primary";
    return classes;
  }

  formatCount() {
    const { value } = this.props.counter;
    return value === 0 ? "Zero" : value;
  }
}
export default Counter;
