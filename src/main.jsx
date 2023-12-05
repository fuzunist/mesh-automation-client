import ReactDOM from "react-dom/client";
import "./assets/css/globals.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/index";
import { Provider } from "react-redux";
import store from "./store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={routes}></RouterProvider>
  </Provider>
);
