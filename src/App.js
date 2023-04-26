import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { CategoryGradePairProvider } from "./contexts/CategoryGradePairContext";
import { CurrentContestProvider } from "./contexts/CurrentContestContext";
import { JudgeContextProvider } from "./contexts/JudgeContext";
import { PromoterContextProvider } from "./contexts/PromoterContext";
import { SelectedMenuProvider } from "./contexts/SelectedMenuContext";
import ContestNotice from "./pages/ContestNotice";
import ContestsList from "./pages/ContestsList";
import ContestView from "./pages/ContestView";
import Home from "./pages/Home";
import CategoryOnlyAdmin from "./pages/onlyadmin/CategoryOnlyAdmin";
import JudgeOnlyAdmin from "./pages/onlyadmin/JudgeOnlyAdmin";
import PromoterOnlyAdmin from "./pages/onlyadmin/PromoterOnlyAdmin";
import StartPage from "./pages/StartPage";
import EntryList from "./pages/EntryList";
import EntryManage from "./pages/EntryManage";
import { CategorysGradesContextProvider } from "./contexts/CategoryContext";

function App() {
  return (
    <CurrentContestProvider>
      <SelectedMenuProvider>
        <JudgeContextProvider>
          <PromoterContextProvider>
            <CategorysGradesContextProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/startcontest"
                    element={<Home children={<StartPage />} />}
                  />
                  <Route
                    path="/contestlistpre"
                    element={<Home children={<ContestsList group={"pre"} />} />}
                  />
                  <Route
                    path="/contestnotice"
                    element={<Home children={<ContestNotice />} />}
                  />
                  <Route
                    path="/entrylist"
                    element={<Home children={<EntryList />} />}
                  />
                  <Route
                    path="/entryadd"
                    element={<Home children={<EntryManage mode={"add"} />} />}
                  />
                  <Route
                    path="/entrymanage"
                    element={<Home children={<EntryManage mode={"read"} />} />}
                  />
                  <Route
                    path="/categoryonlyadmin"
                    element={<Home children={<CategoryOnlyAdmin />} />}
                  />
                  <Route
                    path="/promoteronlyadmin"
                    element={<Home children={<PromoterOnlyAdmin />} />}
                  />
                  <Route
                    path="/judgeonlyadmin"
                    element={<Home children={<JudgeOnlyAdmin />} />}
                  />
                  <Route
                    path="/contestview/:contestId"
                    element={<Home children={<ContestView />} />}
                  />
                </Routes>
              </BrowserRouter>
            </CategorysGradesContextProvider>
          </PromoterContextProvider>
        </JudgeContextProvider>
      </SelectedMenuProvider>
    </CurrentContestProvider>
  );
}

export default App;
