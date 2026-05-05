import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPin, Briefcase, Bookmark } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useState } from 'react';

interface BrandCardProps {
  brand: any;
}

export default function BrandCard({ brand }: BrandCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-border rounded-2xl flex flex-col h-full">
        <div className="relative">
          <div className="w-full h-32 bg-gradient-to-br from-background to-primary/20 flex items-center justify-center overflow-hidden">
            {brand.profileImage ? (
              <img
                src={brand.profileImage}
                alt={brand.name}
                className="w-full h-full object-cover opacity-80"
              />
            ) : null}
          </div>
          <button
            onClick={() => setSaved(!saved)}
            className="absolute top-3 right-3 w-8 h-8 bg-background rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <Bookmark
              className={`w-4 h-4 ${saved ? 'fill-primary text-primary' : 'text-foreground'}`}
            />
          </button>
          <div className="absolute -bottom-8 left-5">
            <div className="w-16 h-16 bg-background rounded-xl shadow-md border border-border flex items-center justify-center overflow-hidden">
                 {brand.profileImage ? (
                    <img src={brand.profileImage} alt={brand.name} className="w-full h-full object-cover" />
                 ) : (
                    <span className="text-xl font-bold text-foreground uppercase">{brand.name?.charAt(0) || 'B'}</span>
                 )}
            </div>
          </div>
        </div>

        <div className="p-5 pt-10 flex-1 flex flex-col">
          <div className="mb-3">
            <h3 className="font-semibold text-lg mb-1">{brand.name}</h3>
            {brand.category && <p className="text-sm text-foreground">{brand.category}</p>}
          </div>

          <div className="flex flex-col gap-2 mb-4 text-sm flex-1">
            {brand.location && (
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{brand.location.split(',')[0]}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-foreground">
                <Briefcase className="w-4 h-4" />
                <span className="truncate">Active Campaigns Available</span>
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            <Link to={`/brand/${brand._id || brand.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Brand
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
