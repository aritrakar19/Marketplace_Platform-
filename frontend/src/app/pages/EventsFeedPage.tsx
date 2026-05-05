import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { apiUrl } from '@/lib/api';
import { Calendar, MapPin, Briefcase, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function EventsFeedPage() {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    fetchEvents();
  }, [categoryFilter, typeFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let url = apiUrl('/events?');
      if (categoryFilter !== 'All') url += `category=${categoryFilter}&`;
      if (typeFilter !== 'All') url += `eventType=${typeFilter}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="dashboard" />
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Opportunities & Events</h1>
            <p className="text-foreground">Discover and apply to sponsorships, collaborations, and events.</p>
          </div>
          {currentUser && (
            <Link to="/events/create">
              <Button className="bg-primary text-[#2b2635] hover:bg-primary/90">
                <PlusCircle className="w-4 h-4 mr-2" />
                Post Opportunity
              </Button>
            </Link>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <select 
            className="flex h-10 w-full md:w-64 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Sponsorship">Sponsorship</option>
            <option value="Collaboration">Collaboration</option>
            <option value="Hiring">Hiring</option>
            <option value="Event">Event</option>
            <option value="Promotion">Promotion</option>
            <option value="Other">Other</option>
          </select>

          <select 
            className="flex h-10 w-full md:w-48 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="p-6 h-64 animate-pulse bg-background border-none" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-background rounded-2xl border border-border">
            <h3 className="text-xl font-bold text-foreground mb-2">No opportunities found</h3>
            <p className="text-foreground mb-6">Try adjusting your filters or post a new opportunity.</p>
            {currentUser && (
              <Link to="/events/create">
                <Button className="bg-primary text-[#2b2635]">Post Opportunity</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event._id} className="p-6 rounded-2xl border-border flex flex-col h-full hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary" className="bg-background text-foreground">
                    {event.category}
                  </Badge>
                  <Badge variant="outline" className={event.role === 'brand' ? 'border-primary text-primary' : 'border-border text-foreground'}>
                    Posted by {event.role === 'brand' ? 'Brand' : 'Talent'}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-foreground mb-4 line-clamp-3 text-sm flex-1">{event.description}</p>
                
                <div className="space-y-2 mb-6">
                  {event.deadline && (
                    <div className="flex items-center text-sm text-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      Deadline: {new Date(event.deadline).toLocaleDateString()}
                    </div>
                  )}
                  {event.eventType && (
                    <div className="flex items-center text-sm text-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.eventType} {event.location ? `- ${event.location}` : ''}
                    </div>
                  )}
                </div>
                
                <Link to={`/events/${event._id}`} className="mt-auto">
                  <Button className="w-full bg-[#2b2635] text-foreground hover:bg-background">View Details</Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
