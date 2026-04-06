import { useParams, Link } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import {
  MapPin,
  Users,
  TrendingUp,
  CheckCircle,
  Instagram,
  Youtube,
  Twitter,
  MessageCircle,
  Bookmark,
  Share2,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import { mockTalents } from '../data/mockData';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function TalentProfile() {
  const { id } = useParams();
  const talent = mockTalents.find((t) => t.id === id);
  const [saved, setSaved] = useState(false);

  if (!talent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Talent not found</h1>
          <Link to="/explore">
            <Button>Back to Explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Cover Image */}
      <div className="relative h-80 bg-gradient-to-r from-blue-600 to-blue-800">
        {talent.coverImage && (
          <img
            src={talent.coverImage}
            alt="Cover"
            className="w-full h-full object-cover opacity-50"
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-20">
        {/* Profile Header */}
        <Card className="p-8 mb-8 rounded-2xl">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative">
              <img
                src={talent.profileImage}
                alt={talent.name}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              {talent.verified && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{talent.name}</h1>
                  <p className="text-lg text-gray-600 mb-2">{talent.subCategory}</p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{talent.location}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSaved(!saved)}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${
                        saved ? 'fill-blue-600 text-blue-600' : ''
                      }`}
                    />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Link to="/chat">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Invite for Collaboration
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Followers</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {formatFollowers(talent.followers)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Engagement</span>
                  </div>
                  <div className="text-2xl font-bold">{talent.engagementRate}%</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-sm">Posts</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {talent.stats.posts.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Avg. Likes</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {formatFollowers(talent.stats.avgLikes)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card className="p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">{talent.bio}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {talent.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Portfolio */}
            {talent.portfolio.length > 0 && (
              <Card className="p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {talent.portfolio.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <img
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-48 object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer"
                      />
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}

            {/* Past Collaborations */}
            {talent.collaborations.length > 0 && (
              <Card className="p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Past Collaborations</h2>
                <div className="space-y-4">
                  {talent.collaborations.map((collab, index) => (
                    <div key={index}>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">{collab.brand[0]}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{collab.brand}</h3>
                          <p className="text-gray-600 text-sm mb-1">
                            {collab.description}
                          </p>
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{collab.date}</span>
                          </div>
                        </div>
                      </div>
                      {index < talent.collaborations.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Media */}
            <Card className="p-6 rounded-2xl">
              <h3 className="font-semibold mb-4">Social Media</h3>
              <div className="space-y-3">
                {talent.socialMedia.instagram && (
                  <a
                    href={`https://instagram.com/${talent.socialMedia.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-pink-600" />
                    <span className="text-sm">{talent.socialMedia.instagram}</span>
                  </a>
                )}
                {talent.socialMedia.youtube && (
                  <a
                    href={`https://youtube.com/@${talent.socialMedia.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Youtube className="w-5 h-5 text-red-600" />
                    <span className="text-sm">{talent.socialMedia.youtube}</span>
                  </a>
                )}
                {talent.socialMedia.twitter && (
                  <a
                    href={`https://twitter.com/${talent.socialMedia.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">{talent.socialMedia.twitter}</span>
                  </a>
                )}
              </div>
            </Card>

            {/* Category */}
            <Card className="p-6 rounded-2xl">
              <h3 className="font-semibold mb-4">Category</h3>
              <Badge className="bg-blue-600 text-white">{talent.category}</Badge>
            </Card>

            {/* Recommended Talents */}
            <Card className="p-6 rounded-2xl">
              <h3 className="font-semibold mb-4">Similar Talents</h3>
              <div className="space-y-4">
                {mockTalents
                  .filter(
                    (t) => t.category === talent.category && t.id !== talent.id
                  )
                  .slice(0, 3)
                  .map((t) => (
                    <Link
                      key={t.id}
                      to={`/talent/${t.id}`}
                      className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors"
                    >
                      <img
                        src={t.profileImage}
                        alt={t.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{t.name}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {formatFollowers(t.followers)} followers
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
