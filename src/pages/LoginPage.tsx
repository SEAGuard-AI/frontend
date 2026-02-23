import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, AlertTriangle, User, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginPage = () => {
  const { login, guestLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">ADRRS</h1>
          <p className="text-sm text-muted-foreground">ASEAN Disaster Response & Recovery System</p>
        </div>

        {/* Alert Banner */}
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 p-3">
          <AlertTriangle className="h-4 w-4 text-primary shrink-0" />
          <p className="text-xs text-primary">3 active disasters in your region</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
            {loading ? 'Signing in...' : isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Guest Access */}
        <Button
          variant="outline"
          onClick={guestLogin}
          className="w-full h-12 border-border text-foreground hover:bg-accent"
        >
          <User className="mr-2 h-4 w-4" />
          Continue as Guest
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
