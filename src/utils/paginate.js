import _ from "lodash";

// 參1要切開的總陣列，參2你所click的第幾頁，參3你一頁中所容納多少item
// 由於paginate函式要做reuse，這裡的參1引數不稱作movies，用items可以更通用
export default function paginate(items, pageNumber, pageSize) {
  const startIndex = (pageNumber - 1) * pageSize;
  // 我們要計算每個分頁一開始的index，所以要計算分頁第一個movie的index
  // 每分頁的開始index = 第幾頁 -1 再乘上每頁容納的items
  // 比如pageNumber = 2(第二頁), pageSize= 4，第二頁起始索引就是4，也就是從頭數到第5個movie
  // let a = _(items); // 先將[]物件陣列用lodash包裹起來
  // let b = _(items).slice(startIndex); // 根據你是在第幾頁，從startIndex切開留下之後index
  // let c = _(items).slice(startIndex).take(pageSize); // 根據一頁要容納多少items，從startIndex之後取多少items
  let d = _(items).slice(startIndex).take(pageSize).value(); // 重新將lodash包裹恢復為原來的array
  return d;
}
