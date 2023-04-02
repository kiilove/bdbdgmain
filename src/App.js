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
import InvoiceList from "./pages/InvoiceList";
import CategoryOnlyAdmin from "./pages/onlyadmin/CategoryOnlyAdmin";
import JudgeOnlyAdmin from "./pages/onlyadmin/JudgeOnlyAdmin";
import PromoterOnlyAdmin from "./pages/onlyadmin/PromoterOnlyAdmin";
import StartPage from "./pages/StartPage";

function App() {
  return (
    <CurrentContestProvider>
      <SelectedMenuProvider>
        <JudgeContextProvider>
          <PromoterContextProvider>
            <CategoryGradePairProvider>
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
                    path="/invoicelist"
                    element={<Home children={<InvoiceList />} />}
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
            </CategoryGradePairProvider>
          </PromoterContextProvider>
        </JudgeContextProvider>
      </SelectedMenuProvider>
    </CurrentContestProvider>
  );
}

export default App;
