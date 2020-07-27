import "./styles/style.scss";
import {
    calculateTime
} from "./js/calculateTime";
import {
    formSubmitHandler
} from "./js/app";

const saveBtn = document.getElementById("save-trip-btn");

saveBtn.addEventListener("click", formSubmitHandler);

export * from "./js/app";