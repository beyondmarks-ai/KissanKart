import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Leaf, Eye, EyeOff, ArrowLeft, ShoppingBag, Tractor, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

type UserRole = 'farmer' | 'customer' | null;

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const urlRole = searchParams.get('role') as 'farmer' | 'customer' | null;
  
  const [selectedRole, setSelectedRole] = useState<UserRole>(urlRole);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});

  const { signIn, signUp, user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'farmer') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, profile, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; fullName?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    if (!isLogin && !fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedRole) return;
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
        }
      } else {
        const { error } = await signUp(email, password, fullName, selectedRole);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in instead.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Account created successfully!');
        }
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      id: 'customer' as const,
      title: 'Customer',
      subtitle: 'Shop fresh produce',
      description: 'Browse and buy fresh fruits & vegetables directly from local farmers',
      icon: ShoppingBag,
      color: 'primary',
      features: ['Browse products', 'Easy checkout', 'Track orders', 'Rate farmers'],
    },
    {
      id: 'farmer' as const,
      title: 'Farmer',
      subtitle: 'Sell your produce',
      description: 'List and sell your fresh produce directly to customers',
      icon: Tractor,
      color: 'kisan-orange',
      features: ['List products', 'Manage orders', 'Track sales', 'Direct payments'],
    },
  ];

  // Role Selection Screen
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-kisan-leaf/5">
        <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8">
          {/* Back Link */}
          <Link
            to="/"
            className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Logo */}
          <div className="mb-10 text-center">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                <Leaf className="h-7 w-7" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-2xl font-bold text-foreground">
                  Kissan<span className="text-primary">Kart</span>
                </span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  Farm Fresh Produce
                </span>
              </div>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Welcome to KissanKart
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              How would you like to use our platform?
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid w-full max-w-3xl gap-6 sm:grid-cols-2">
            {roleOptions.map((option) => {
              const Icon = option.icon;
              const isCustomer = option.id === 'customer';
              
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedRole(option.id)}
                  className={`group relative overflow-hidden rounded-2xl border-2 bg-card p-6 text-left shadow-md transition-all duration-300 hover:shadow-xl ${
                    isCustomer
                      ? 'border-primary/20 hover:border-primary hover:shadow-primary/10'
                      : 'border-kisan-orange/20 hover:border-kisan-orange hover:shadow-kisan-orange/10'
                  }`}
                >
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                      isCustomer
                        ? 'bg-gradient-to-br from-primary/5 to-transparent'
                        : 'bg-gradient-to-br from-kisan-orange/5 to-transparent'
                    }`}
                  />

                  <div className="relative">
                    {/* Icon */}
                    <div
                      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                        isCustomer
                          ? 'bg-primary/10 text-primary'
                          : 'bg-kisan-orange/10 text-kisan-orange'
                      }`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>

                    {/* Title */}
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-foreground">{option.title}</h3>
                      <p
                        className={`text-sm font-medium ${
                          isCustomer ? 'text-primary' : 'text-kisan-orange'
                        }`}
                      >
                        {option.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="mb-4 text-sm text-muted-foreground">{option.description}</p>

                    {/* Features */}
                    <ul className="mb-4 space-y-2">
                      {option.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-foreground/80">
                          <CheckCircle2
                            className={`h-4 w-4 ${
                              isCustomer ? 'text-primary' : 'text-kisan-orange'
                            }`}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div
                      className={`flex items-center gap-2 font-medium ${
                        isCustomer ? 'text-primary' : 'text-kisan-orange'
                      }`}
                    >
                      Continue as {option.title}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Already have account hint */}
          <p className="mt-8 text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={() => setSelectedRole('customer')}
              className="font-medium text-primary hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Auth Form Screen
  const currentRole = roleOptions.find((r) => r.id === selectedRole)!;
  const isCustomer = selectedRole === 'customer';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-kisan-leaf/5">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => setSelectedRole(null)}
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Choose a different role
        </button>

        {/* Auth Card */}
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            {/* Header */}
            <div className="mb-8 text-center">
              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                  isCustomer ? 'bg-primary/10' : 'bg-kisan-orange/10'
                }`}
              >
                <currentRole.icon
                  className={`h-8 w-8 ${isCustomer ? 'text-primary' : 'text-kisan-orange'}`}
                />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {isLogin ? 'Welcome Back!' : `Join as ${currentRole.title}`}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {isLogin
                  ? 'Sign in to your account'
                  : currentRole.description}
              </p>
            </div>

            {/* Login/Signup Toggle Pills */}
            <div className="mb-6 flex rounded-xl bg-muted/50 p-1">
              {[
                { id: true, label: 'Sign In' },
                { id: false, label: 'Sign Up' },
              ].map((tab) => (
                <button
                  key={String(tab.id)}
                  type="button"
                  onClick={() => {
                    setIsLogin(tab.id);
                    setErrors({});
                  }}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                    isLogin === tab.id
                      ? isCustomer
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-kisan-orange text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={errors.fullName ? 'border-destructive' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-destructive">{errors.fullName}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className={`w-full ${
                  !isCustomer ? 'bg-kisan-orange hover:bg-kisan-orange/90' : ''
                }`}
                size="lg"
                disabled={loading}
              >
                {loading
                  ? 'Please wait...'
                  : isLogin
                  ? 'Sign In'
                  : `Create ${currentRole.title} Account`}
              </Button>
            </form>

            {/* Role indicator badge */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  isCustomer
                    ? 'bg-primary/10 text-primary'
                    : 'bg-kisan-orange/10 text-kisan-orange'
                }`}
              >
                <currentRole.icon className="h-3 w-3" />
                {currentRole.title} Account
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
