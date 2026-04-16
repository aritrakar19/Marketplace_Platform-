import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '../../context/AuthContext';
import { Users, Activity, Mail, MapPin, Instagram, Youtube, Twitter, Hash, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { apiUrl } from '@/lib/api';

interface ChatProfileModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatProfileModal({ userId, isOpen, onClose }: ChatProfileModalProps) {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !isOpen || !currentUser) return;
      
      setLoading(true);
      setError(null);
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch(apiUrl(`/users/${userId}`), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setProfile(data.data);
        } else {
          setError(data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Connection error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">User Profile</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 text-sm animate-pulse">Fetching details...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block border border-red-100">
              {error}
            </div>
          </div>
        ) : profile ? (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            {/* Header Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-blue-600 uppercase">
                      {profile.name?.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{profile.fullName || profile.name}</h3>
                <p className="text-blue-600 font-medium">@{profile.displayName || profile.name?.toLowerCase().replace(/\s+/g, '')}</p>
                <div className="flex justify-center flex-wrap gap-2 mt-2">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none capitalize">{profile.role}</Badge>
                  {profile.category && (
                    <Badge className="bg-purple-50 text-purple-600 border-none capitalize">{profile.category}</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 flex items-center gap-3 bg-gray-50/50 hover:bg-gray-50 transition-colors border-none shadow-sm">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Followers</p>
                  <p className="text-lg font-bold text-gray-900">{profile.followers || '0'}</p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-3 bg-gray-50/50 hover:bg-gray-50 transition-colors border-none shadow-sm">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Engagement</p>
                  <p className="text-lg font-bold text-gray-900">{profile.engagementRate || '0%'}</p>
                </div>
              </Card>
            </div>

            {/* Info Section */}
            <div className="space-y-4">
              {profile.bio && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2 uppercase tracking-tight">
                    About
                  </h4>
                  <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 italic text-gray-600 text-sm leading-relaxed">
                    {profile.bio}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Contact & Location</h4>
                <div className="grid gap-2">
                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm font-medium">{profile.email}</span>
                   </div>
                   {profile.location && (
                     <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">{profile.location}</span>
                     </div>
                   )}
                </div>
              </div>

              {/* Social Media Links */}
              {profile.socialMedia && Object.values(profile.socialMedia).some(v => v) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Social Networks</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {profile.socialMedia.instagram && (
                      <a href={`https://instagram.com/${profile.socialMedia.instagram}`} target="_blank" rel="noreferrer" 
                        className="flex items-center gap-2 p-2 rounded-lg border border-pink-100 bg-pink-50/30 text-pink-700 hover:bg-pink-50 transition-all group">
                        <Instagram className="w-4 h-4" />
                        <span className="text-xs font-semibold truncate">Instagram</span>
                        <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
                      </a>
                    )}
                    {profile.socialMedia.youtube && (
                      <a href={`https://youtube.com/@${profile.socialMedia.youtube}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg border border-red-100 bg-red-50/30 text-red-700 hover:bg-red-50 transition-all group">
                        <Youtube className="w-4 h-4" />
                        <span className="text-xs font-semibold truncate">YouTube</span>
                        <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
                      </a>
                    )}
                    {profile.socialMedia.twitter && (
                      <a href={`https://twitter.com/${profile.socialMedia.twitter}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg border border-blue-100 bg-blue-50/30 text-blue-700 hover:bg-blue-50 transition-all group">
                        <Twitter className="w-4 h-4" />
                        <span className="text-xs font-semibold truncate">Twitter</span>
                        <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
                      </a>
                    )}
                    {profile.socialMedia.tiktok && (
                      <a href={`https://tiktok.com/@${profile.socialMedia.tiktok}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100 transition-all group">
                        <Hash className="w-4 h-4" />
                        <span className="text-xs font-semibold truncate">TikTok</span>
                        <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
