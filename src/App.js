import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { CurrentContestProvider } from "./contexts/CurrentContestContext";
import { SelectedMenuProvider } from "./contexts/SelectedMenuContext";
import ContestNotice from "./pages/ContestNotice";
import Home from "./pages/Home";
import StartPage from "./pages/StartPage";

function App() {
  return (
    <CurrentContestProvider>
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
    </CurrentContestProvider>
  );
}

export default App;
