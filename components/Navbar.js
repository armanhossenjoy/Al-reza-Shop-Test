'use client'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { cart } = useCart()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check active session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    checkUser()

    // Listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-green-900/95 backdrop-blur-sm border-b border-green-800 text-white shadow-lg transition-all">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tight flex items-center gap-2 hover:text-green-200 transition">
          🌿 Al Reza Organic
        </Link>
        
        <div className="flex gap-6 items-center font-medium">
          <Link href="/cart" className="relative group hover:text-green-200 transition">
            Cart 
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-yellow-400 text-green-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {loading ? (
            <div className="w-20 h-8 bg-green-800/50 animate-pulse rounded" />
          ) : user ? (
            <div className="flex gap-6 items-center">
              <Link href="/orders" className="hover:text-green-200 transition">
                Orders
              </Link>
              <div className="hidden md:flex flex-col items-end leading-tight">
                <span className="text-xs text-green-300">Welcome back</span>
                <span className="text-sm font-semibold">{user.email.split('@')[0]}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm transition shadow-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-white text-green-900 px-5 py-2 rounded-full font-semibold hover:bg-green-50 transition shadow-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
