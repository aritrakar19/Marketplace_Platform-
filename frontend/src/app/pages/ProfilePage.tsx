import { Link } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar variant="dashboard" />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link to="/dashboard" aria-label="Back to dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-sm text-gray-500">View and edit how others see you</p>
          </div>
        </div>

        {isTalent && (
          <Card className="p-6 shadow-sm border border-blue-100 bg-gradient-to-b from-blue-50/70 to-white">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Connect your social accounts</h2>
            <p className="text-sm text-gray-600 mb-4">
              Link Facebook and Instagram through Meta, or connect YouTube. You can still add handles manually in your
              profile below.
            </p>
            <SocialConnectButtons layout="stack" className="sm:flex-row sm:flex-wrap" />
          </Card>
        )}

        <Card className="p-6 sm:p-8 shadow-sm border border-gray-200 bg-white">
          <ProfilePanel showHeading={false} fetchOnMount />
        </Card>
      </main>
      <Footer />
    </div>
  );
}
