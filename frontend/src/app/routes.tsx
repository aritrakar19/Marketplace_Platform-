import { createBrowserRouter, Navigate } from "react-router";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ExploreTalent from "./pages/ExploreTalent";
import ExploreBrands from "./pages/ExploreBrands";
import TalentProfile from "./pages/TalentProfile";
import BrandDashboard from "./pages/BrandDashboard";
import CampaignsPage from "./pages/CampaignsPage";
import CampaignDetails from "./pages/CampaignDetails";
import ChatPage from "./pages/ChatPage";
import PaymentPage from "./pages/PaymentPage";
import AdminPanel from "./pages/AdminPanel";
import ProfileSetup from "./pages/ProfileSetup";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

// Wrapper for /auth to redirect logged in users to dashboard
const AuthRoute = () => {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  if (currentUser) return <Navigate to="/dashboard" replace />;
  return <AuthPage />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/auth",
    Component: AuthRoute,
  },
  {
    path: "/explore",
    Component: ExploreTalent,
  },
  {
    path: "/talent/:id",
    Component: TalentProfile,
  },
  {
    element: <ProtectedRoute />, // All children are protected
    children: [
      {
        path: "/profile-setup",
        Component: ProfileSetup,
      },
      {
        path: "/explore-brands",
        Component: ExploreBrands,
      },
      {
        path: "/dashboard",
        Component: BrandDashboard,
      },
      {
        path: "/profile",
        Component: ProfilePage,
      },
      {
        path: "/settings",
        Component: SettingsPage,
      },
      {
        path: "/campaigns",
        Component: CampaignsPage,
      },
      {
        path: "/campaigns/:id",
        Component: CampaignDetails,
      },
      {
        path: "/chat",
        Component: ChatPage,
      },
      {
        path: "/payment",
        Component: PaymentPage,
      },
      {
        path: "/admin",
        Component: AdminPanel,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
