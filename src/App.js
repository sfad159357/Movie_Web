import React, { Component } from "react";
// import "./App.css";
import CounterNavbar from "./components/counter/CounterNavbar";
import Counters from "./components/counter/Counters";

class App extends Component {
  state = {
    counters: [
      { id: 1, value: 0 },
      { id: 2, value: 0 },
      { id: 3, value: 0 },
      { id: 4, value: 0 },
    ],
  };
  constructor(props) {
    super(props);
    console.log("App元件起始化", props);
  }

  componentDidMount() {
    console.log("App元件已掛載");
  }

  render() {
    console.log("App元件render");

    return (
      <React.Fragment>
        <CounterNavbar counters={this.state.counters} />
        <main className="container">
          <Counters
            counters={this.state.counters}
            onReset1={this.handleReset}
            onAdd1={this.handleIncr}
            onDecr1={this.handleDecr}
            onDelete1={this.handleDelete}
          />
        </main>
      </React.Fragment>
    );
  }
  handleReset = () => {
    this.setState({
      counters: this.state.counters.map((counter) => {
        counter.value = 0;
        return counter;
      }),
    });
  };

  // 改用箭頭函式的話，裡面的this不用透過bind(this)來綁，就是直接綁定
  handleIncr = (counter) => {
    const counters = [...this.state.counters];
    const index = counters.indexOf(counter);
    counters[index] = { ...counter }; // 如果counter不用...淺複製，就無法區分prevProps和更新後props的值
    counters[index].value++;
    this.setState({
      counters,
    });
  };

  handleDecr = (counter) => {
    const counters = [...this.state.counters];
    const index = counters.indexOf(counter);
    counters[index] = { ...counter }; // 如果counter不用...淺複製，就無法區分prevProps和更新後props的值
    counters[index].value--;
    this.setState({
      counters,
    });
  };

  handleDelete = (id) => {
    this.setState({
      counters: this.state.counters.filter((counter) => counter.id !== id),
    });
  };
}

export default App;
