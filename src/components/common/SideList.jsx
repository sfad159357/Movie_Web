import React from "react";

function SideList({
  items,
  textProperty,
  valueProperty,
  onItemSelect,
  selectedItem,
}) {
  return (
    <ul className="list-group">
      {items.map((item) => (
        <li
          key={item[valueProperty]}
          onClick={() => onItemSelect(item)}
          className={
            item === selectedItem ? "list-group-item active" : "list-group-item"
          }
        >
          {item[textProperty]}
        </li>
      ))}
    </ul>
  );
}

// 這裡用來處理母元件的props中data的屬性轉換
// 透過新增預設props來做decouple，進行格式轉化
SideList.defaultProps = {
  textProperty: "name",
  valueProperty: "_id",
};

export default SideList;
