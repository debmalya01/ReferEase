import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  ArrowRight,
  Building2,
  Users,
  Briefcase,
  Star,
  CheckCircle2,
  Zap,
  Target,
  TrendingUp,
} from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="p-6 rounded-xl border bg-white/50 hover:bg-white hover:border-primary/20 hover:shadow-lg transition-all duration-300">
      <div className="text-primary mb-4 bg-primary/10 w-fit p-3 rounded-lg">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b sticky top-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">ReferEase</h1>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-3xl mx-auto mb-10">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Your Fast Track to Dream Jobs
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with industry professionals, get referrals, and land your dream job with ReferEase's powerful networking platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="text-lg" asChild>
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg" asChild>
                <Link to="/about">See How It Works</Link>
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">15K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">5K+</div>
              <div className="text-sm text-muted-foreground">Successful Referrals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Partner Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">85%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose ReferEase?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides everything you need to accelerate your job search and career growth
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Building2 className="h-8 w-8" />}
              title="Top Companies"
              description="Connect with professionals from leading tech companies and startups."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="Fast Track Referrals"
              description="Skip the line with direct employee referrals to your dream companies."
            />
            <FeatureCard
              icon={<Target className="h-8 w-8" />}
              title="Smart Matching"
              description="Our AI matches you with the perfect referrers based on your skills and goals."
            />
            <FeatureCard
              icon={<CheckCircle2 className="h-8 w-8" />}
              title="Verified Profiles"
              description="All referrers are verified employees at their respective companies."
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Career Growth"
              description="Get insights and guidance from industry professionals."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Community"
              description="Join a community of like-minded professionals and mentors."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started with ReferEase in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StepCard
              number="1"
              title="Create Profile"
              description="Sign up and create your professional profile with your skills and experience."
            />
            <StepCard
              number="2"
              title="Find Matches"
              description="Browse and connect with verified employees at your target companies."
            />
            <StepCard
              number="3"
              title="Get Referred"
              description="Receive referrals and track your application progress in real-time."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of professionals who have already found their dream jobs through ReferEase.
          </p>
          <Button size="lg" variant="secondary" className="text-lg" asChild>
            <Link to="/register">Get Started Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/press" className="hover:text-white transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/guides" className="hover:text-white transition-colors">Guides</Link></li>
                <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Briefcase className="h-5 w-5" />
              <span className="font-bold text-white">ReferEase</span>
            </div>
            © {new Date().getFullYear()} ReferEase. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const StepCard = ({ number, title, description }) => {
  return (
    <div className="relative p-6 text-center">
      <div className="text-4xl font-bold text-primary/20 mb-4">{number}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Home; 