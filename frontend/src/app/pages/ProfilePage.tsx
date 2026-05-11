import { Link } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import ProfilePanel from '../components/ProfilePanel';
import SocialConnectButtons from '../components/SocialConnectButtons';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { userData, userRole } = useAuth();
  const isTalent = userData?.role === 'talent' || userRole === 'talent';

  return (
    <div className="min-h-screen bg-[#2b2635] flex flex-col">
      <Navbar variant="dashboard" />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pb-bottom-nav space-y-4 md:space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="shrink-0 hover:bg-[#342e40] rounded-xl">
            <Link to="/dashboard" aria-label="Back to dashboard">
              <ArrowLeft className="w-5 h-5 text-[#e8e6ed]" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#e8e6ed]">Profile</h1>
            <p className="text-xs md:text-sm text-[#9d97a8]">View and edit how others see you</p>
          </div>
        </div>

        {isTalent && (
          <Card className="p-4 md:p-6 glass-card border-0 rounded-[20px]">
            <h2 className="text-base md:text-lg font-semibold text-[#e8e6ed] mb-1">Connect your social accounts</h2>
            <p className="text-xs md:text-sm text-[#9d97a8] mb-4">
              Link Facebook and Instagram through Meta, or connect YouTube. You can still add handles manually in your
              profile below.
            </p>
            <SocialConnectButtons layout="stack" className="sm:flex-row sm:flex-wrap" />
          </Card>
        )}

        <Card className="p-4 sm:p-6 md:p-8 glass-card border-0 rounded-[20px]">
          <ProfilePanel showHeading={false} fetchOnMount />
        </Card>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
