import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import Dashboard from "./pages/Dashboard";
import Match from "./pages/Match";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/match" element={<Match />} />
          <Route path="/match/:id" element={<Match />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
