
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { CheckCircle, MapPin, Users, TrendingUp, Bookmark } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { apiUrl } from '@/lib/api';

interface TalentCardProps {
  talent: any;
  isConnected?: boolean;
  isPending?: boolean;
}

export default function TalentCard({ talent, isConnected = false, isPending = false }: TalentCardProps) {
  const [saved, setSaved] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const { currentUser } = useAuth();

  const handleInvite = async () => {
    if (!currentUser) {
      toast.error('Please login to send invites');
      return;
    }

    setInviting(true);
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(apiUrl('/invites'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ receiverId: talent.firebaseUid || talent.uid || talent._id || talent.id })
      });

      const data = await response.json();
      if (data.success) {
        setInviteSent(true);
        toast.success('Invite Sent!', {
          description: `You've invited ${talent.name} to collaborate.`
        });
      } else {
        toast.error(data.message || 'Failed to send invite');
      }
    } catch (error) {
      console.error('Invite error:', error);
      toast.error('Something went wrong');
    } finally {
      setInviting(false);
    }
  };

  const formatFollowers = (count: any) => {
    if (!count) return 'N/A';
    if (typeof count === 'string') return count;
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 rounded-2xl">
        <div className="relative">
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
            {talent.profileImage ? (
              <img
                src={talent.profileImage}
                alt={talent.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-blue-500 uppercase">{talent.name?.charAt(0) || 'T'}</span>
            )}
          </div>
          <button
            onClick={() => setSaved(!saved)}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <Bookmark
              className={`w-4 h-4 ${saved ? 'fill-blue-600 text-blue-600' : 'text-gray-600'}`}
            />
          </button>
          {talent.verified && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-blue-600 text-white gap-1 py-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </Badge>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="mb-3">
            <h3 className="font-semibold text-lg mb-1">{talent.name}</h3>
            <p className="text-sm text-gray-500">{talent.subCategory}</p>
          </div>

          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Users className="w-4 h-4" />
              <span>{formatFollowers(talent.followers)}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>{talent.engagementRate || 'N/A'}{talent.engagementRate && !talent.engagementRate.includes('%') ? '%' : ''}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{talent.location ? talent.location.split(',')[0] : 'Remote'}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {(talent.tags || talent.portfolio || []).slice(0, 3).map((tag: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="text-xs truncate max-w-[100px]">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            {!isConnected ? (
              <>
                <Link to={`/talent/${talent._id || talent.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </Link>
                <div className="flex-1">
                  <Button 
                    onClick={handleInvite} 
                    disabled={inviting || inviteSent || isPending}
                    className={`w-full ${(inviteSent || isPending) ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {inviting ? 'Sending...' : (inviteSent || isPending) ? 'Invite Sent' : 'Quick Invite'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button disabled variant="outline" className="flex-1 bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Friend
                </Button>
                <Link to="/chat" className="flex-1">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Message
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
