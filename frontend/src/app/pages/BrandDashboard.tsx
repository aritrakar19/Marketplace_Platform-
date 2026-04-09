import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  MessageSquare,
  Bookmark,
  TrendingUp,
  Eye,
  UserPlus,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useState, useEffect } from 'react';
import InvitesList from '../components/InvitesList';

const performanceData = [
  { month: 'Jan', campaigns: 4, engagement: 3200 },
  { month: 'Feb', campaigns: 6, engagement: 4800 },
  { month: 'Mar', campaigns: 8, engagement: 6400 },
  { month: 'Apr', campaigns: 5, engagement: 5200 },
  { month: 'May', campaigns: 9, engagement: 7800 },
  { month: 'Jun', campaigns: 12, engagement: 9600 },
];

const savedTalents = [
  { name: 'Sarah Johnson', category: 'Influencer', followers: '850K', image: 'https://images.unsplash.com/photo-1615843644216-14d9b92a02ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { name: 'Marcus Williams', category: 'Athlete', followers: '1.2M', image: 'https://images.unsplash.com/photo-1671518707590-4900d05ad5e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { name: 'Emma Rodriguez', category: 'Player', followers: '650K', image: 'https://images.unsplash.com/photo-1758179761789-87792b6132a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
];

import { useAuth } from '../../context/AuthContext';

export default function BrandDashboard() {
  const { userData, currentUser } = useAuth();
  const [campaignCount, setCampaignCount] = useState<number | null>(null);
  const [connections, setConnections] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/campaigns/count?status=open');
        const data = await res.json();
        if (data.success) {
          setCampaignCount(data.data.count);
        }
      } catch (error) {
        console.error('Error fetching campaign count:', error);
      }
      
      try {
        if (!currentUser) return;
        const token = await currentUser.getIdToken();
        const res = await fetch('http://localhost:5000/api/connections', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) {
          setConnections(data.data);
        }
      } catch (error) {
        console.error('Error fetching connections:', error);
      }
    };
    fetchData();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="dashboard" />

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-medium"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            {userData?.role === 'talent' ? (
              <Link
                to="/explore-brands"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span>Find Brands</span>
              </Link>
            ) : (
              <Link
                to="/explore"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span>Find Talent</span>
              </Link>
            )}
            <Link
              to="/campaigns"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Briefcase className="w-5 h-5" />
              <span>Campaigns</span>
            </Link>
            <Link
              to="/chat"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors relative"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
              <Badge className="ml-auto bg-red-500">3</Badge>
            </Link>
            <Link
              to="#"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Bookmark className="w-5 h-5" />
              <span>Saved Talents</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {userData?.fullName || userData?.name || 'Brand Manager'}!</h1>
                <p className="text-gray-600">Here's what's happening with your campaigns</p>
              </div>
              <Link to="/campaigns">
                <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Post New Campaign
                </Button>
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">+12%</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {campaignCount !== null ? campaignCount : '...'}
                </div>
                <div className="text-sm text-gray-600">Active Campaigns</div>
              </Card>

              <Card className="p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">+8%</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">156</div>
                <div className="text-sm text-gray-600">Collaborations</div>
              </Card>

              <Card className="p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">+24%</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">4.8M</div>
                <div className="text-sm text-gray-600">Total Reach</div>
              </Card>

              <Card className="p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">+16%</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">$84K</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 rounded-2xl">
                <h3 className="font-semibold text-lg mb-6">Campaign Performance</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    <Bar dataKey="campaigns" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 rounded-2xl">
                <h3 className="font-semibold text-lg mb-6">Engagement Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ fill: '#2563eb', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Campaigns & Invites */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6 rounded-2xl">
                  <InvitesList />
                </Card>

                <Card className="p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">Active Campaigns</h3>
                    <Link to="/campaigns">
                      <Button variant="ghost" size="sm">View All</Button>
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        title: 'Summer Athletic Wear Launch',
                        applicants: 24,
                        deadline: 'May 15, 2026',
                        budget: '$5,000 - $10,000',
                        status: 'active',
                      },
                      {
                        title: 'Sustainable Fashion Campaign',
                        applicants: 32,
                        deadline: 'May 20, 2026',
                        budget: '$4,000 - $8,000',
                        status: 'active',
                      },
                      {
                        title: 'Beauty Product Review Series',
                        applicants: 45,
                        deadline: 'Apr 25, 2026',
                        budget: '$2,500 - $5,000',
                        status: 'pending',
                      },
                    ].map((campaign, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-xl hover:border-blue-600 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold">{campaign.title}</h4>
                          <Badge
                            className={
                              campaign.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700'
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <UserPlus className="w-4 h-4" />
                            <span>{campaign.applicants} applicants</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{campaign.deadline}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{campaign.budget}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* My Connections */}
              <Card className="p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">My Connections</h3>
                  <Link to={userData?.role === 'talent' ? "/explore-brands" : "/explore"}>
                    <Button variant="ghost" size="sm">Find More</Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {connections.length > 0 ? connections.map((conn, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {conn.profileImage ? (
                        <img
                          src={conn.profileImage}
                          alt={conn.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold uppercase">
                          {conn.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{conn.name}</div>
                        <div className="text-xs text-gray-500">{conn.role || 'User'}</div>
                      </div>
                      <Link to="/chat">
                        <Button size="icon" variant="ghost" className="text-blue-600">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500 text-center py-4">No connections yet.</p>
                  )}
                  <Link to={userData?.role === 'talent' ? "/explore-brands" : "/explore"}>
                    <Button variant="outline" className="w-full mt-2">
                      {userData?.role === 'talent' ? 'Find More Brands' : 'Find More Talent'}
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
