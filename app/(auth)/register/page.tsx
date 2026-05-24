"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [success,  setSuccess]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    // Redirect after short delay so user sees the confirmation message
    setTimeout(() => router.push("/account"), 2000);
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-brand-gray-50 px-4 pt-20">
        <div className="w-full max-w-md text-center bg-white p-10">
          <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-6">
            <span className="text-brand-gold text-2xl">✓</span>
          </div>
          <h2 className="font-heading text-2xl text-brand-blue mb-3">Account Created</h2>
          <div className="gold-divider my-4" />
          <p className="font-body text-sm text-brand-gray-500">
            Welcome to Blue Nova. Check your email to confirm your account.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-gray-50 px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="font-heading text-4xl text-brand-blue block mb-2">
            Blue Nova
          </Link>
          <div className="gold-divider mt-4 mb-6" />
          <p className="section-subheading">Create Your Account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7 bg-white p-10">
          {error && (
            <p className="font-body text-xs text-red-500 border border-red-200 bg-red-50 px-4 py-3">
              {error}
            </p>
          )}

          <div>
            <label className="block font-body text-xs tracking-widest uppercase text-brand-gray-500 mb-3">
              Full Name
            </label>
            <input
              type="text"
              required
              className="input-luxury w-full"
              placeholder="Ada Okonkwo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-body text-xs tracking-widest uppercase text-brand-gray-500 mb-3">
              Email Address
            </label>
            <input
              type="email"
              required
              className="input-luxury w-full"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-body text-xs tracking-widest uppercase text-brand-gray-500 mb-3">
              Password <span className="normal-case text-brand-gray-400">(min. 6 characters)</span>
            </label>
            <input
              type="password"
              required
              className="input-luxury w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account…" : "Create Account"}
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-4">
            <div className="flex-1 border-t border-brand-gray-200" />
            <span className="font-body text-xs text-brand-gray-400 tracking-widest uppercase">or</span>
            <div className="flex-1 border-t border-brand-gray-200" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-brand-gray-200 font-body text-sm text-brand-blue hover:border-brand-gold transition-colors duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <p className="text-center font-body text-xs text-brand-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-gold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
