// import { toast } from "react-toastify";

const toast = (store) => (next) => (action) => {
  if (action.type === "error") console.log("Toastify", action.payload.message);
  else return next(action);
};

export default toast;
