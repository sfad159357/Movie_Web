import React from "react";
import _ from "lodash"; // underscore
import PropTypes from "prop-types";

export default function Pagination({
  itemsCount,
  pageSize,
  currentPage,
  onPageChange,
}) {
  const pageCount = Math.ceil(itemsCount / pageSize); // pageCount頁數，Math.ceil()用來將浮點數直接進位到個位數，比如：2.25 -> 3
  if (pageCount === 1) return null;
  const pages = _.range(1, pageCount + 1); // pageCount=2.25, 結果：[1,2,3]

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {pages.map((page) => (
          <li
            className={page === currentPage ? "page-item active" : "page-item"}
            key={page}
          >
            <a
              href="#bottom"
              className="page-link"
              onClick={() => onPageChange(page)}
            >
              {page}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// 檢查props的型態，注意大小寫，模組用pascal雙頭，用其屬性要用駝峰式表達
Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
