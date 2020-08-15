import React, { Component } from "react";

// 從母元件MoviesTable之props取得
// columns: array
// sortColumn: object
// onSort:function

export class TableHeader extends Component {
  // 處理path和order的邏輯在TableHeader元件本身額外宣告的方法處理就好
  raiseSort = (path) => {
    const sortedColumn = { ...this.props.sortedColumn };
    if (sortedColumn.path === path)
      // 如果連續點擊欄位主題，path沒變，sortColumn.path就不用另外給值，會跳到下一個判斷式
      // 決定升序還降序，透過反向條件式，如果等於asc，就會跳到true,?決定desc；如果不等於asc，就會跳到false,:決定asc
      sortedColumn.order = sortedColumn.order === "asc" ? "desc" : "asc";
    else {
      // 如果沒有連續點
      sortedColumn.path = path;
      sortedColumn.order = "asc";
    }
    this.props.onSort(sortedColumn); // 處理好path和order，再傳送sortColumn完整的物件回去給母元件Movie做setState
  };

  renderIcon = (col) => {
    const { sortedColumn } = this.props;
    if (col.path !== sortedColumn.path) return null;
    return sortedColumn.order === "asc" ? (
      <i className="fa fa-sort-asc"></i>
    ) : (
      <i className="fa fa-sort-desc"></i>
    );
  };

  render() {
    const { columns } = this.props;
    return (
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.label || col.key}
              onClick={() => this.raiseSort(col.path)}
              className="clickable"
            >
              {col.label} {this.renderIcon(col)}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
}

export default TableHeader;
