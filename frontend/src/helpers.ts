import { toast, Bounce } from "react-toastify";

export const toastF = (message: string, typeMessage: string) => {
  toast(message, {
    type: typeMessage === "success" ? "success" : typeMessage === "info" ? "info" : "error", //toast type
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    transition: Bounce,
  });
};
