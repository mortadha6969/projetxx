import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import WebsiteFooter from "./components/WebsiteFooter/WebsiteFooter.js";
import Home from "./Interfaces/Home/Home";
import RegisterPage from "./Interfaces/RegisterPage/RegisterPage.js";
import LoginPage from "./Interfaces/LoginPage/LoginPage";
import ProfileAccountPage from "./Interfaces/ProfileAccountPage/ProfileAccountPage.js";
import CampaignPage from "./Interfaces/CampaignPage/CampaignPage";
import CreateCampaignPage from "./Interfaces/CreateCampaignPage/CreateCampaignPage"; // Correct import
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

function App() {
  return (
    <div className="App-Container">
      <Router>
        <Navbar />
        <main>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/campaign" element={<CampaignPage />} />
              <Route path="/Register" element={<RegisterPage />} />
              <Route path="/Login" element={<LoginPage />} />
              <Route path="/ProfileAccountPage" element={<ProfileAccountPage />} />
              <Route path="/create-campaign" element={<CreateCampaignPage />} /> {/* Correct route path */}
            </Routes>
          </ErrorBoundary>
        </main>
        <WebsiteFooter />
      </Router>
    </div>
  );
}

export default App;
