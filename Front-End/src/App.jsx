import AppRouter from "./routes/AppRouter";
import { CartProvider } from "./context/cartContext";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </div>
  );
}

export default App;
