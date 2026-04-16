import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Calendar, DollarSign, Users, Briefcase, CheckCircle, ArrowLeft } from 'lucide-react';
import { apiUrl } from '@/lib/api';

interface Campaign {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  status: string;
  createdAt: string;
  requirements?: string[];
  applicants?: number;
  brandInfo?: {
    name?: string;
    fullName?: string;
    displayName?: string;
  };
}

export default function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(apiUrl(`/campaigns/${id}`));
        const data = await res.json();
        if (data.success) {
          setCampaign(data.data);
        }
      } catch (error) {
        console.error('Error fetching campaign details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCampaign();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Loading campaign details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex-1">
          <h1 className="text-2xl font-bold mb-4">Campaign not found</h1>
          <Link to="/campaigns">
            <Button>Back to Campaigns</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const brandName = campaign.brandInfo?.displayName || campaign.brandInfo?.fullName || campaign.brandInfo?.name || 'Unknown Brand';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <Link
          to="/campaigns"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campaigns
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="p-8 rounded-2xl mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-lg font-bold text-gray-700">
                      {brandName.charAt(0)}
                    </div>
                    <span className="font-medium">{brandName}</span>
                  </div>
                </div>
                <Badge
                  className={
                    campaign.status === 'active' || campaign.status === 'open'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }
                >
                  {campaign.status}
                </Badge>
              </div>

              <Separator className="my-6" />

              <div>
                <h2 className="text-xl font-semibold mb-4">Campaign Description</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{campaign.description}</div>
              </div>

              {campaign.requirements && campaign.requirements.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                    <ul className="space-y-3">
                      {campaign.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 rounded-2xl">
              <h3 className="font-semibold mb-4">Campaign Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Budget</div>
                    <div className="font-semibold">${campaign.budget}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Posted On</div>
                    <div className="font-semibold">
                      {new Date(campaign.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Applicants</div>
                    <div className="font-semibold">{campaign.applicants || 0}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Category</div>
                    <div className="font-semibold">{campaign.category}</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-3" size="lg">
                Apply Now
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Contact Brand
              </Button>
            </Card>

            <Card className="p-6 rounded-2xl bg-blue-50 border-blue-200">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-700 mb-4">
                Have questions about this campaign? Our support team is here to help.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
