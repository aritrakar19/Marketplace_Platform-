import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { useAuth } from '../../context/AuthContext';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { MapPin, Mail, Instagram, Youtube, Twitter, Hash, Edit2, Check, Users, Activity, Link as LinkIcon } from 'lucide-react';
import { auth } from '../../services/firebase';

export default function ProfileModal({ children }: { children: React.ReactNode }) {
  const { userData: profileData, loading: authLoading, setUserData } = useAuth();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    category: '',
    subCategory: '',
    followers: '',
    engagementRate: '',
    location: '',
    portfolio: '',
    profileImage: ''
  });

  useEffect(() => {
    if (profileData && open) {
      setFormData({
        name: profileData.name || '',
        bio: profileData.bio || '',
        category: profileData.category || '',
        subCategory: profileData.subCategory || '',
        followers: profileData.followers || '',
        engagementRate: profileData.engagementRate || '',
        location: profileData.location || '',
        portfolio: profileData.portfolio ? profileData.portfolio.join(', ') : '',
        profileImage: profileData.profileImage || ''
      });
    }
    if (!open) {
      setIsEditing(false);
    }
  }, [profileData, open]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await auth.currentUser?.getIdToken();
      
      const payload = {
        ...formData,
        portfolio: formData.portfolio.split(',').map(s => s.trim()).filter(Boolean)
      };

      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const data = await res.json();
        setUserData(data.data || data);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  // Loading state checks the global context loading
  const loading = authLoading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {isEditing ? 'Edit Profile' : 'Your Profile'}
          </DialogTitle>
          {!loading && profileData && !isEditing && (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
          )}
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Profile Photo</Label>
                  <div className="flex items-center gap-4 mt-2 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border border-gray-300">
                      {formData.profileImage ? (
                        <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-xs">No Photo</span>
                      )}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setFormData({ ...formData, profileImage: reader.result as string });
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="cursor-pointer flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>Email (Read-only)</Label>
                  <Input value={profileData?.email || ''} disabled className="bg-gray-100" />
                </div>
                <div>
                  <Label>Name</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Your full name" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Influencer, Athlete" />
                </div>
                <div>
                  <Label>Sub-Category</Label>
                  <Input value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})} placeholder="e.g. Fitness, E-Sports" />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Los Angeles, CA" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Followers</Label>
                    <Input value={formData.followers} onChange={e => setFormData({...formData, followers: e.target.value})} placeholder="e.g. 1.2M" />
                  </div>
                  <div>
                    <Label>Engagement Rate</Label>
                    <Input value={formData.engagementRate} onChange={e => setFormData({...formData, engagementRate: e.target.value})} placeholder="e.g. 4.5%" />
                  </div>
                </div>
                <div>
                  <Label>Portfolio Links (comma separated)</Label>
                  <Input value={formData.portfolio} onChange={e => setFormData({...formData, portfolio: e.target.value})} placeholder="https://link1.com, https://link2.com" />
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Tell us about yourself..." className="h-24" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          ) : profileData ? (
            <div className="space-y-6">
              {/* Header section w/ stats */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full overflow-hidden flex items-center justify-center text-blue-600 font-bold text-2xl uppercase border-2 border-white shadow-sm">
                    {profileData.profileImage ? (
                      <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      profileData.displayName?.charAt(0) || profileData.name?.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{profileData.fullName || profileData.name}</h3>
                    <p className="text-gray-500 font-medium">@{profileData.displayName || profileData.name?.toLowerCase().replace(/\s+/g, '')}</p>
                  </div>
                </div>
                
                {(profileData.followers || profileData.engagementRate) && (
                  <div className="flex gap-4 p-3 bg-blue-50 rounded-xl">
                    {profileData.followers && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-blue-900">{profileData.followers}</span>
                      </div>
                    )}
                    {profileData.engagementRate && (
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-blue-900">{profileData.engagementRate}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="capitalize select-none">{profileData.role}</Badge>
                {profileData.category && (
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none select-none">
                    {profileData.category}
                  </Badge>
                )}
                {profileData.subCategory && (
                  <Badge variant="outline" className="border-blue-200 text-blue-700 select-none">
                     {profileData.subCategory}
                  </Badge>
                )}
              </div>

              {/* Details card */}
              <Card className="p-4 bg-gray-50/50 border border-gray-100 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{profileData.email}</span>
                  </div>
                  {profileData.location && (
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Bio */}
              {profileData.bio && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">About</h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                    {profileData.bio}
                  </p>
                </div>
              )}

              {/* Portfolio Links */}
              {profileData.portfolio && profileData.portfolio.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Portfolio</h4>
                  <div className="space-y-2">
                    {profileData.portfolio.map((link: string, idx: number) => (
                      <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline p-2 border rounded-lg bg-gray-50">
                        <LinkIcon className="w-4 h-4" />
                        <span className="truncate">{link}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Media */}
              {profileData.socialMedia && Object.values(profileData.socialMedia).some(val => val) && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Social Links</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {profileData.socialMedia.instagram && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                        <Instagram className="w-4 h-4 text-pink-600" />
                        <span className="truncate">@{profileData.socialMedia.instagram}</span>
                      </div>
                    )}
                    {profileData.socialMedia.youtube && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                        <Youtube className="w-4 h-4 text-red-600" />
                        <span className="truncate">@{profileData.socialMedia.youtube}</span>
                      </div>
                    )}
                    {profileData.socialMedia.twitter && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                        <Twitter className="w-4 h-4 text-blue-400" />
                        <span className="truncate">@{profileData.socialMedia.twitter}</span>
                      </div>
                    )}
                    {profileData.socialMedia.tiktok && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                        <Hash className="w-4 h-4 text-black" />
                        <span className="truncate">@{profileData.socialMedia.tiktok}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-red-50 rounded-xl border border-red-100">
              <p>Failed to load profile data.</p>
              <p className="text-sm mt-1">Please try again later.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
