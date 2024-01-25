import { BrowserRouter, Routes, Route } from "react-router-dom";
import Forecast from "./pages/Forecast";
import Error from "./pages/Error";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Forecast />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
};

export default App;
