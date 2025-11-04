import { Routes, Route, BrowserRouter } from "react-router-dom";
import ChessScreen from "./pages/ChessScreen";
import HomeScreen from "./pages/HomeScreen";
import Account from "./pages/Account";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/chess" element={<ChessScreen />} />
          <Route path="/account" element={<Account />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
