import Admin from "./pages/Admin/Admin";

function App() {
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <div className="app-container">
      {/* Mostrar solo la vista de administrador para revisión */}
      <Admin onLogout={handleLogout} />
    </div>
  );
}

export default App;
