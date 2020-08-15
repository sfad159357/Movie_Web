import React from "react";

// ...rest : value, type, onChanged，可以這樣用操作子，概念等同destruction，<Input value={value} ...>，props和值的名稱一樣就能這樣使用
export default function Input({ name, label, error, ...rest }) {
  return (
    <div className="form-group mt-4">
      <label htmlFor={name}>{label}</label>
      <input
        // value={this.state.data.xxx}子元素input的值綁住母元素LoginForm state
        //   ref={this.ref物件}
        {...rest}
        className="form-control"
        name={name}
      />

      {/* error存在，就是truthy，顯示最後一個statement;假如不存在，就是false。 */}
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}
