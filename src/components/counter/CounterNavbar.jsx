import React, { Component } from "react";

export class CounterNavbar extends Component {
  render() {
    console.log("nav元件render");

    const itemsCounter = this.props.counters.filter(
      (counter) => counter.value > 0
    ).length;

    return (
      <nav className="navbar navbar-light bg-light">
        <button type="button" className="link-button">
          Showing{" "}
          <span className="badge badge-pill badge-secondary">
            {itemsCounter}
          </span>{" "}
          items in shopping cart.
        </button>
      </nav>
    );
  }
}

export default CounterNavbar;
