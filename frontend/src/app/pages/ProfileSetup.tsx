import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, ArrowRight, Check, Upload } from 'lucide-react';
import { categories } from '../data/mockData';

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    category: '',
    subCategory: '',
    bio: '',
    location: '',
    instagram: '',
    youtube: '',
    twitter: '',
    tiktok: '',
  });
  const navigate = useNavigate();

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const selectedCategory = categories.find((c) => c.name === formData.category);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4">Profile Setup</Badge>
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">
            Step {step} of {totalSteps}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4 text-sm">
            <span className={step >= 1 ? 'text-blue-600 font-semibold' : 'text-gray-400'}>
              Basic Info
            </span>
            <span className={step >= 2 ? 'text-blue-600 font-semibold' : 'text-gray-400'}>
              Category
            </span>
            <span className={step >= 3 ? 'text-blue-600 font-semibold' : 'text-gray-400'}>
              Social Media
            </span>
            <span className={step >= 4 ? 'text-blue-600 font-semibold' : 'text-gray-400'}>
              Portfolio
            </span>
          </div>
        </div>

        <Card className="p-8 rounded-2xl">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
                <p className="text-gray-600 mb-6">
                  Let's start with some basic information about you
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="John Doe"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                    placeholder="johndoe"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This is how you'll appear to others
                  </p>
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Los Angeles, CA"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Category */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Choose Your Category</h2>
                <p className="text-gray-600 mb-6">Select the category that best describes you</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className={`p-6 cursor-pointer hover:border-blue-600 transition-all ${
                      formData.category === category.name
                        ? 'border-blue-600 border-2 bg-blue-50'
                        : ''
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, category: category.name, subCategory: '' })
                    }
                  >
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </Card>
                ))}
              </div>

              {selectedCategory && (
                <div>
                  <Label>Sub-Category *</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {selectedCategory.subCategories.map((subCat) => (
                      <button
                        key={subCat}
                        onClick={() => setFormData({ ...formData, subCategory: subCat })}
                        className={`p-3 text-left rounded-xl border-2 hover:border-blue-600 transition-all ${
                          formData.subCategory === subCat
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="text-sm font-medium">{subCat}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Social Media */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Social Media Accounts</h2>
                <p className="text-gray-600 mb-6">
                  Connect your social media profiles to showcase your reach
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      @
                    </span>
                    <Input
                      id="instagram"
                      value={formData.instagram}
                      onChange={(e) =>
                        setFormData({ ...formData, instagram: e.target.value })
                      }
                      placeholder="username"
                      className="pl-8"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="youtube">YouTube</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      youtube.com/@
                    </span>
                    <Input
                      id="youtube"
                      value={formData.youtube}
                      onChange={(e) =>
                        setFormData({ ...formData, youtube: e.target.value })
                      }
                      placeholder="channel"
                      className="pl-32"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      @
                    </span>
                    <Input
                      id="twitter"
                      value={formData.twitter}
                      onChange={(e) =>
                        setFormData({ ...formData, twitter: e.target.value })
                      }
                      placeholder="username"
                      className="pl-8"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tiktok">TikTok</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      @
                    </span>
                    <Input
                      id="tiktok"
                      value={formData.tiktok}
                      onChange={(e) =>
                        setFormData({ ...formData, tiktok: e.target.value })
                      }
                      placeholder="username"
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Portfolio */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Portfolio</h2>
                <p className="text-gray-600 mb-6">
                  Upload your best work to showcase your skills (optional)
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-600 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Upload Portfolio Images</p>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop or click to browse
                </p>
                <Button variant="outline">Choose Files</Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">You can skip this step</p>
                    <p className="text-blue-700">
                      You can always add portfolio items later from your dashboard
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="text-sm text-gray-500">
              Profile Completion: {Math.round(progress)}%
            </div>

            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 gap-2">
              {step === totalSteps ? 'Complete' : 'Next'}
              {step === totalSteps ? (
                <Check className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
