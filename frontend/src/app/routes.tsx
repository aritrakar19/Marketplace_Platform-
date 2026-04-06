import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ExploreTalent from "./pages/ExploreTalent";
import TalentProfile from "./pages/TalentProfile";
import BrandDashboard from "./pages/BrandDashboard";
import CampaignsPage from "./pages/CampaignsPage";
import CampaignDetails from "./pages/CampaignDetails";
import ChatPage from "./pages/ChatPage";
import PaymentPage from "./pages/PaymentPage";
import AdminPanel from "./pages/AdminPanel";
import ProfileSetup from "./pages/ProfileSetup";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/auth",
    Component: AuthPage,
  },
  {
    path: "/profile-setup",
    Component: ProfileSetup,
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
    path: "/dashboard",
    Component: BrandDashboard,
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
  {
    path: "*",
    Component: NotFound,
  },
]);
