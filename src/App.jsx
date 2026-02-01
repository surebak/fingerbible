import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import BibleReader from "./pages/BibleReader";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path=":version/:book/:chapter" element={<BibleReader />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
