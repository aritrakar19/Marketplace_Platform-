import { Link } from 'react-router';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TM</span>
              </div>
              <span className="font-semibold text-lg text-white">TalentMatch</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Connecting brands with the perfect influencers, athletes, and players for impactful collaborations.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* For Brands */}
          <div>
            <h3 className="font-semibold text-white mb-4">For Brands</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/explore" className="text-sm hover:text-white transition-colors">
                  Find Talent
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="text-sm hover:text-white transition-colors">
                  Post Campaign
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-sm hover:text-white transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* For Talent */}
          <div>
            <h3 className="font-semibold text-white mb-4">For Talent</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/auth" className="text-sm hover:text-white transition-colors">
                  Join as Talent
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="text-sm hover:text-white transition-colors">
                  Browse Campaigns
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-white transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-white transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2026 TalentMatch. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
