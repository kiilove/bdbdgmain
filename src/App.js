import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { SelectedMenuProvider } from "./contexts/SelectedMenuContext";
import ContestNotice from "./pages/ContestNotice";
import Home from "./pages/Home";
import StartPage from "./pages/StartPage";

function App() {
  return (
    <SelectedMenuProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/startcontest"
            element={<Home children={<StartPage />} />}
          />{" "}
          <Route
            path="/contestnotice"
            element={<Home children={<ContestNotice />} />}
          />
        </Routes>
      </BrowserRouter>
    </SelectedMenuProvider>
  );
}

export default App;
