import { Routes, Route, BrowserRouter } from "react-router-dom";
import ChessScreen from "./pages/ChessScreen";
import HomeScreen from "./pages/HomeScreen";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/chess" element={<ChessScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
