// functional component

import React from "react";

// 函數要加參數props，才能夠使用props，注意，props不用加this
export default function Like({ isLiked, onLike }) {
  return (
    <div>
      <div>
        <button className="btn">
          <i
            onClick={onLike}
            className={isLiked ? "fa fa-heart" : "fa fa-heart-o"}
            aria-hidden="true"
          ></i>
        </button>
      </div>
    </div>
  );
}
