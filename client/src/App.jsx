// Import Dependencies
import { Route, Routes } from "react-router-dom";

// Import Components
import Home from "./pages/Home";

// Import Styles
import "./App.css";

function App() {
  return (
    <div className="w-screen min-h-screen flex flex-col font-inter">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
