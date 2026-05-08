import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import NotificationsPopover from './NotificationsPopover';
import logo from '../../assets/marketplace_logo.jpeg';

interface NavbarProps {
  variant?: 'default' | 'dashboard';
}

export default function Navbar({ variant = 'default' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout, userData } = useAuth();

  if (variant === 'dashboard') {
    return (
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="TalentMatch Logo" className="w-35 h-8 rounded-lg object-cover" />
              {/* <span className="font-semibold text-lg">TalentMatch</span> */}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {userData?.role === 'talent' ? (
                <Link to="/explore-brands" className="text-foreground hover:text-foreground transition-colors">
                  Find Brands
                </Link>
              ) : (
                <Link to="/explore" className="text-foreground hover:text-foreground transition-colors">
                  Find Talents
                </Link>
              )}
              <Link to="/events" className="text-foreground hover:text-foreground transition-colors">
                Events
              </Link>
              <Link to="/campaigns" className="text-foreground hover:text-foreground transition-colors">
                Campaigns
              </Link>
              <Link to="/#how-it-works" className="text-foreground hover:text-foreground transition-colors">
                How it Works
              </Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/dashboard" className="hidden md:block">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <NotificationsPopover />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="overflow-hidden rounded-full border border-border h-9 w-9"
                    aria-label="Account menu"
                  >
                    {userData?.profileImage ? (
                      <img src={userData.profileImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-sm font-medium truncate">
                        {userData?.fullName || userData?.name || 'Account'}
                      </span>
                      {userData?.email && (
                        <span className="text-xs text-muted-foreground truncate">{userData.email}</span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-foreground focus:text-foreground cursor-pointer"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-background backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="TalentMatch Logo" className="w-35 h-8 rounded-lg object-cover" />
            {/* <span className="font-semibold text-lg">TalentMatch</span> */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {userData?.role === 'talent' ? (
              <Link to="/explore-brands" className="text-foreground hover:text-foreground transition-colors">
                Find Brands
              </Link>
            ) : (
              <Link to="/explore" className="text-foreground hover:text-foreground transition-colors">
                Find Talents
              </Link>
            )}
            <Link to="/events" className="text-foreground hover:text-foreground transition-colors">
              Events
            </Link>
            {/* {currentUser && (
              <Link to="/my-events" className="text-foreground hover:text-foreground transition-colors">
                My Events
              </Link>
            )} */}
            <Link to="/campaigns" className="text-foreground hover:text-foreground transition-colors">
              Campaigns
            </Link>
            <Link to="/#how-it-works" className="text-foreground hover:text-foreground transition-colors">
              How it Works
            </Link>
            {currentUser ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button variant="outline" onClick={() => logout()}>Log Out</Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/auth">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-primary text-[#2b2635] hover:bg-primary text-[#2b2635]">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {userData?.role === 'talent' ? (
                <Link
                  to="/explore-brands"
                  className="text-foreground hover:text-foreground transition-colors px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Brands
                </Link>
              ) : (
                <Link
                  to="/explore"
                  className="text-foreground hover:text-foreground transition-colors px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Talents
                </Link>
              )}
              <Link
                to="/events"
                className="text-foreground hover:text-foreground transition-colors px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore Events
              </Link>
              {currentUser && (
                <Link
                  to="/my-events"
                  className="text-foreground hover:text-foreground transition-colors px-4 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Events
                </Link>
              )}
              <Link
                to="/campaigns"
                className="text-foreground hover:text-foreground transition-colors px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Campaigns
              </Link>
              <Link
                to="/#how-it-works"
                className="text-foreground hover:text-foreground transition-colors px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it Works
              </Link>
              <div className="flex flex-col gap-2 px-4 pt-2">
                {currentUser ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        Log In
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-primary text-[#2b2635] hover:bg-primary text-[#2b2635]">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
