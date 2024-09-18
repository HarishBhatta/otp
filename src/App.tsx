import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import OtpPage from "./pages/Otppage";
import Success from "./pages/Success";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OtpPage />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;
