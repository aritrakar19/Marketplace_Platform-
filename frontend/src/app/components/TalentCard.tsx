import { Talent } from '../data/mockData';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { CheckCircle, MapPin, Users, TrendingUp, Bookmark } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useState } from 'react';

interface TalentCardProps {
  talent: Talent;
}

export default function TalentCard({ talent }: TalentCardProps) {
  const [saved, setSaved] = useState(false);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 rounded-2xl">
        <div className="relative">
          <img
            src={talent.profileImage}
            alt={talent.name}
            className="w-full h-48 object-cover"
          />
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
              <span>{talent.engagementRate}%</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{talent.location.split(',')[0]}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {talent.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Link to={`/talent/${talent.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </Link>
            <Link to="/chat" className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Quick Invite
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
