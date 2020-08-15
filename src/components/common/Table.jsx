import React from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

export default function Table({ columns, onSort, sortedColumn, items }) {
  return (
    <table className="table table-striped mt-4 md-4">
      <TableHeader
        columns={columns}
        onSort={onSort}
        sortedColumn={sortedColumn}
      />
      <TableBody items={items} columns={columns} />
    </table>
  );
}
