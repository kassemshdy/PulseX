'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, X, Loader2, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    siteName: '',
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Real-time validation states
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  // Check email availability with debounce
  useEffect(() => {
    if (!formData.email || formData.email.length < 3) {
      setEmailAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setEmailChecking(true);
      try {
        const response = await fetch(
          `/api/auth/check-email?email=${encodeURIComponent(formData.email)}`
        );
        const data = await response.json();
        setEmailAvailable(data.available);
        if (!data.available && data.error) {
          setFieldErrors((prev) => ({ ...prev, email: data.error }));
        } else {
          setFieldErrors((prev) => {
            const { email, ...rest } = prev;
            return rest;
          });
        }
      } catch (error) {
        console.error('Email check failed:', error);
      } finally {
        setEmailChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email]);


  // Update password strength
  useEffect(() => {
    setPasswordStrength({
      length: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      lowercase: /[a-z]/.test(formData.password),
      number: /[0-9]/.test(formData.password),
    });
  }, [formData.password]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setErrors(data.errors || ['Signup failed. Please try again.']);
        setLoading(false);
        return;
      }

      // Success! Redirect to admin panel
      window.location.href = data.redirectUrl;
    } catch (error) {
      console.error('Signup error:', error);
      setErrors(['An unexpected error occurred. Please try again.']);
      setLoading(false);
    }
  };

  const isPasswordStrong = Object.values(passwordStrength).every((v) => v);
  const canSubmit = 
    formData.email &&
    formData.password &&
    formData.siteName &&
    emailAvailable === true &&
    isPasswordStrong &&
    !loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full flex gap-8">
        {/* Left side - Form */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PulseX</span>
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600">
              Start building your website in minutes
            </p>
          </div>

          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                    <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                    fieldErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="you@example.com"
                />
                {emailChecking && (
                  <Loader2 className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 animate-spin" />
                )}
                {!emailChecking && emailAvailable === true && (
                  <Check className="absolute right-3 top-3.5 w-5 h-5 text-green-600" />
                )}
                {!emailChecking && emailAvailable === false && (
                  <X className="absolute right-3 top-3.5 w-5 h-5 text-red-600" />
                )}
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* Site Name */}
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-2">
                Website Name
              </label>
              <input
                id="siteName"
                name="siteName"
                type="text"
                required
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="My Awesome Site"
              />
              <p className="mt-1 text-sm text-gray-500">
                This will be displayed as your website name
              </p>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicators */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="text-sm font-medium text-gray-700">Password Requirements:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'length', label: 'At least 8 characters' },
                      { key: 'uppercase', label: 'One uppercase letter' },
                      { key: 'lowercase', label: 'One lowercase letter' },
                      { key: 'number', label: 'One number' },
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        className={`flex items-center gap-2 text-sm ${
                          passwordStrength[key as keyof typeof passwordStrength]
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {passwordStrength[key as keyof typeof passwordStrength] ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                canSubmit
                  ? 'bg-primary hover:bg-primary/90 shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating your account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* Right side - Benefits */}
        <div className="hidden lg:block flex-1">
          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white h-full">
            <h2 className="text-3xl font-bold mb-6">
              Start Building Today
            </h2>
            <div className="space-y-6">
              {[
                {
                  title: 'Powerful Admin Panel',
                  description: 'Manage all your content from a beautiful, intuitive dashboard.',
                },
                {
                  title: 'Visual Page Builder',
                  description: 'Drag and drop to create beautiful pages without coding.',
                },
                {
                  title: 'Dynamic Content Types',
                  description: 'Create any content structure. Articles, products, portfolios - anything!',
                },
                {
                  title: 'Social Media Automation',
                  description: 'Auto-publish to Facebook, Twitter, YouTube, and more.',
                },
                {
                  title: 'Multi-Language Support',
                  description: 'Reach global audiences with built-in translation management.',
                },
                {
                  title: 'Enterprise Security',
                  description: 'Your content is safe with role-based access and encryption.',
                },
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-white/80 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-sm text-white/80">
                🎉 No credit card required • Cancel anytime • Free tier forever
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

