import { Link } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Mail, Bell } from 'lucide-react';

export default function SettingsPage() {
  const { userData } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="dashboard" />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link to="/dashboard" aria-label="Back to dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-foreground">Account and preferences</p>
          </div>
        </div>

        <Card className="p-6 border border-border shadow-sm bg-background">
          <div className="flex items-start gap-3 mb-4">
            <Mail className="w-5 h-5 text-foreground mt-0.5" />
            <div>
              <h2 className="font-semibold text-foreground">Account</h2>
              <p className="text-sm text-foreground mt-1">Signed in as</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{userData?.email || '—'}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/profile">Edit profile</Link>
          </Button>
        </Card>

        <Card className="p-6 border border-border shadow-sm bg-background">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-foreground mt-0.5" />
            <div>
              <h2 className="font-semibold text-foreground">Notifications</h2>
              <p className="text-sm text-foreground mt-2">
                Invite and message alerts appear in the bell menu on your dashboard. More notification controls can be
                added here later.
              </p>
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
