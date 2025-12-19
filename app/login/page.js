'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Try to sign in
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      // If sign in fails, try to sign up automatically
      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) alert(signUpError.message)
      else alert('Account created! Check your email or login now.')
    } else {
      router.push('/') // Redirect to home
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your Al Reza Organic account</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-400 font-semibold text-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            {loading ? 'Signing In...' : 'Sign In / Create Account'}
          </button>
        </form>
        
        <p className="text-xs text-gray-500 mt-6 text-center leading-relaxed">
          Don't have an account? We'll create one for you automatically when you sign in.
        </p>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-green-600 hover:text-green-800 font-medium transition">
            ← Back to Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
