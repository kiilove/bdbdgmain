import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { CurrentContestProvider } from "./contexts/CurrentContestContext";
import { SelectedMenuProvider } from "./contexts/SelectedMenuContext";
import ContestNotice from "./pages/ContestNotice";
import ContestsList from "./pages/ContestsList";
import ContestView from "./pages/ContestView";
import Home from "./pages/Home";
import CategoryOnlyAdmin from "./pages/onlyadmin/CategoryOnlyAdmin";
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
              path="/contestlistpre"
              element={<Home children={<ContestsList group={"pre"} />} />}
            />
            <Route
              path="/contestnotice"
              element={<Home children={<ContestNotice />} />}
            />
            <Route
              path="/categoryonlyadmin"
              element={<Home children={<CategoryOnlyAdmin />} />}
            />
            <Route
              path="/contestview/:contestId"
              element={<Home children={<ContestView />} />}
            />
          </Routes>
        </BrowserRouter>
      </SelectedMenuProvider>
    </CurrentContestProvider>
  );
}

export default App;
