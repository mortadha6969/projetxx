import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import ModernNavbar from "./components/Navbar/ModernNavbar";
import ModernFooter from "./components/WebsiteFooter/ModernFooter";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import LoadingSpinner from "./components/UI/LoadingSpinner";
import AdminDashboardLink from "./pages/AdminDashboardLink";

// Lazy-loaded pages for better performance
const Home = lazy(() => import("./pages/Home/SimpleHome"));
const RegisterPage = lazy(() => import("./pages/RegisterPage/ModernRegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage/ModernLoginPage"));
const ProfileAccountPage = lazy(() => import("./pages/ProfilePage/ModernProfilePage"));
const CampaignPage = lazy(() => import("./pages/CampaignPage/CampaignPage"));
const CreateCampaignPage = lazy(() => import("./pages/CreateCampaignPage/CreateCampaignPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <ModernNavbar />
          <main className="flex-grow container mx-auto px-4 py-8 md:px-6 mt-16">
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/campaigns" element={<CampaignPage />} />
                  <Route path="/campaign/:id" element={<CampaignPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/login" element={<LoginPage />} />

                  {/* Protected routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfileAccountPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-campaign"
                    element={
                      <ProtectedRoute>
                        <CreateCampaignPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Admin route with both AdminRoute and direct access */}
                  <Route
                    path="/admin"
                    element={
                      <AdminDashboard />
                    }
                  />

                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </main>
          <ModernFooter />
          <AdminDashboardLink />
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
