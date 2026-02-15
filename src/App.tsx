import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.tsx";
import UploadPage from "./pages/UploadPage.tsx";
import ResultsPage from "./pages/ResultsPage.tsx";

const App = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-amway-light/30 to-white">
      <Header />
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </div>
  );
};

export default App;
