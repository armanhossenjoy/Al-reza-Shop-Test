'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-green-800 text-center">Al Reza Login</h2>
        
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-6 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button disabled={loading} className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800">
          {loading ? 'Processing...' : 'Login / Sign Up'}
        </button>
        <p className="text-xs text-gray-500 mt-4 text-center">
          If you don't have an account, we will create one for you automatically.
        </p>
      </form>
    </div>
  )
}
