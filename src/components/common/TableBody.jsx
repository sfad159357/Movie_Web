import React, { Component } from "react";
import _ from "lodash";

// 這裡沒有Like, delete btn的痕跡，已經介面化
export class TableBody extends Component {
  renderCell = (item, col) => {
    if (col.content) return col.content(item); // 假如col有content的值，丟入參數item
    return _.get(item, col.path); // {item[col.path]}
  }; // 使用lodash的原因是因為，有可能物件屬性是巢狀結構，如：genre.name，取得item個別屬性的value

  createKey = (item, col) => {
    return item.id + (col.path || col.key);
  };

  render() {
    const { items, columns } = this.props;
    return (
      <>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              {columns.map((col) => (
                <td key={this.createKey(item, col)}>
                  {this.renderCell(item, col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </>
    );
  }
}

export default TableBody;
