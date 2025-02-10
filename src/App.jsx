import RoutesApp from "./routes";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer autoClose={3000} />
      <RoutesApp />
    </BrowserRouter>
  );
}
