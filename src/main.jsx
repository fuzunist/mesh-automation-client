import ReactDOM from "react-dom/client";
import "./assets/css/globals.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/index";
import { Provider } from "react-redux";
import store from "./store";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import kesme from "./store/reducers/kesme";
import { ThemeProvider } from "@material-tailwind/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApiProvider api={kesme}>
    <ThemeProvider>
      <Provider store={store}>
        <RouterProvider router={routes}></RouterProvider>
      </Provider>
    </ThemeProvider>
  </ApiProvider>
);

window.addEventListener("beforeunload", () => {
  sessionStorage.setItem(
    "beforePathname",
    location.pathname === "/" ? "/dashboard" : location.pathname
  );
});
