import AppRouter from "./routes/AppRouter";
import { CartProvider } from "./context/cartContext";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="app-container">
      <CartProvider>
        <AppRouter />
      </CartProvider>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick
      rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"
      />
    </div>
  );
}

export default App;
