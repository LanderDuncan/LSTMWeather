import { BrowserRouter, Routes, Route } from "react-router-dom";
import Forecast from "./pages/Forecast";
import About from "./pages/About";
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
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
};

export default App;
