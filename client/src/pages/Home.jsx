import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  ArrowRight,
  Building2,
  Users,
  Star,
  CheckCircle2,
  Zap,
  Target,
  TrendingUp,
  Sparkles,
  ArrowDown,
  ChevronRight,
} from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="p-6 rounded-xl border border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-primary/20 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="text-primary mb-4 bg-primary/10 w-fit p-3 rounded-lg group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-primary/90 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">{description}</p>
      </div>
    </div>
  );
};

const Home = () => {
  useEffect(() => {
    // Apply dark mode class to document
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="border-b border-border sticky top-0 bg-card/80 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 group">
            <Link to="/">
              <div className="h-16 flex items-center overflow-hidden">
                <img 
                  src="/BackDoor_Logo_Dark1.png" 
                  alt="BackDoor Logo" 
                  className="max-h-[200%] w-auto" 
                />
              </div>
            </Link>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-colors" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90 transition-colors group" asChild>
              <Link to="/register" className="flex items-center">
                Sign Up Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:40px_40px] opacity-20" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent" />
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-3xl mx-auto mb-10">
            <div className="inline-block mb-4 animate-fade-in">
              <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center group hover:bg-primary/30 transition-colors">
                <Sparkles className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-1000" />
                <span>The Premier Job Referral Platform</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/70 animate-fade-in-up">
              Your Fast Track to Dream Jobs
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up delay-100">
              Connect with industry professionals, get referrals, and land your dream job with BackDoor's powerful networking platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-200">
              <Button size="lg" className="text-lg bg-primary hover:bg-primary/90 group" asChild>
                <Link to="/register" className="flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg border-primary/30 hover:bg-primary/10 hover:text-primary group" asChild>
                <Link to="/about" className="flex items-center">
                  See How It Works
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16">
            <div className="text-center p-4 rounded-lg bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 border border-border/50 group">
              <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">15K+</div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">Active Users</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 border border-border/50 group">
              <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">5K+</div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">Successful Referrals</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 border border-border/50 group">
              <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">Partner Companies</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 border border-border/50 group">
              <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">85%</div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-primary">Why Choose BackDoor?</h2>
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
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-primary">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started with BackDoor in three simple steps
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
      <section className="py-24 bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:40px_40px] opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of professionals who have already found their dream jobs through BackDoor.
          </p>
          <Button size="lg" variant="secondary" className="text-lg bg-black/80 text-white border-none hover:bg-black/90 group" asChild>
            <Link to="/register" className="flex items-center">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-slate-200 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold mb-4 text-primary">Product</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-primary">Company</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/press" className="hover:text-primary transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-primary">Resources</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="/support" className="hover:text-primary transition-colors">Support</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-primary">Legal</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
            <div className="flex items-center justify-center mb-4">
              <div className="h-14 flex items-center overflow-hidden">
                <img 
                  src="/BackDoor_Logo_Dark1.png" 
                  alt="BackDoor Logo" 
                  className="max-h-[200%] w-auto" 
                />
              </div>
            </div>
            <p>© {new Date().getFullYear()} BackDoor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const StepCard = ({ number, title, description }) => {
  return (
    <div className="p-6 rounded-xl bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 border border-border text-center relative hover:shadow-xl group">
      <div className="w-12 h-12 flex items-center justify-center text-xl font-bold bg-primary text-primary-foreground rounded-full mx-auto mb-6 group-hover:scale-110 transition-transform">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-primary/90 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">{description}</p>
    </div>
  );
};

export default Home; 