import React, { Component } from "react";
import Counter from "./Counter";

export class Counters extends Component {
  render() {
    console.log("Counters元件群render");
    const { onReset1, counters, onAdd1, onDecr1, onDelete1 } = this.props;
    return (
      <div>
        <button
          style={this.styles}
          className="btn btn-primary btn-sm m-2"
          onClick={onReset1}
        >
          Reset
        </button>
        {counters.map((counter) => (
          <Counter
            key={counter.id}
            counter={counter}
            onAdd2={onAdd1}
            onDecr2={onDecr1}
            onDelete2={() => onDelete1(counter.id)}
          />
        ))}
      </div>
    );
  }
  styles = {
    fontSize: 20, // react會自動轉換成'10px'
    fontWeight: "bold",
  };
}

export default Counters;
