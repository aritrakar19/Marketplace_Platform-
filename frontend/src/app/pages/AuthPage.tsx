import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Building2, User, ArrowLeft } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'brand' | 'talent' | null>(null);
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup' && role) {
      navigate('/profile-setup');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-blue-800">
        <img
          src="https://images.unsplash.com/photo-1582005450386-52b25f82d9bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGNvbGxhYm9yYXRpb24lMjBtZWV0aW5nfGVufDF8fHx8MTc3NTAyODUzM3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Collaboration"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Welcome to TalentMatch</h2>
            <p className="text-xl text-blue-100">
              Connect with the perfect influencers, athletes, and players for your brand
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Get Started'}
            </h1>
            <p className="text-gray-600">
              {mode === 'login'
                ? 'Log in to your account to continue'
                : 'Create an account to start collaborating'}
            </p>
          </div>

          {/* Role Selection (Signup only) */}
          {mode === 'signup' && !role && (
            <div className="space-y-4 mb-8">
              <Label>I am a...</Label>
              <div className="grid grid-cols-2 gap-4">
                <Card
                  className={`p-6 cursor-pointer hover:border-blue-600 transition-all ${
                    role === 'brand' ? 'border-blue-600 border-2 bg-blue-50' : ''
                  }`}
                  onClick={() => setRole('brand')}
                >
                  <Building2 className="w-8 h-8 mb-3 text-blue-600" />
                  <h3 className="font-semibold mb-1">Brand</h3>
                  <p className="text-sm text-gray-600">Looking for talent</p>
                </Card>
                <Card
                  className={`p-6 cursor-pointer hover:border-blue-600 transition-all ${
                    role === 'talent' ? 'border-blue-600 border-2 bg-blue-50' : ''
                  }`}
                  onClick={() => setRole('talent')}
                >
                  <User className="w-8 h-8 mb-3 text-blue-600" />
                  <h3 className="font-semibold mb-1">Talent</h3>
                  <p className="text-sm text-gray-600">Offering services</p>
                </Card>
              </div>
            </div>
          )}

          {/* Form (Login or after role selection) */}
          {(mode === 'login' || role) && (
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="mt-1"
                />
              </div>

              {mode === 'login' && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </a>
                </div>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                {mode === 'login' ? 'Log In' : 'Continue'}
              </Button>

              <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-4 text-sm text-gray-500">
                  Or continue with
                </span>
              </div>

              <Button type="button" variant="outline" className="w-full" size="lg">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign {mode === 'login' ? 'in' : 'up'} with Google
              </Button>

              <div className="text-center text-sm text-gray-600 mt-4">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setRole(null);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {mode === 'login' ? 'Sign up' : 'Log in'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
