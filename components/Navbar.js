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
    <nav className="p-4 bg-green-800 text-white flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold">🌿 Al Reza Organic</Link>
      
      <div className="flex gap-6 items-center">
        <Link href="/cart" className="hover:text-green-200">
          Cart ({cart.length})
        </Link>

        {loading ? (
          <div className="w-16" /> /* Placeholder to prevent flicker */
        ) : user ? (
          <div className="flex gap-4 items-center">
            <Link href="/orders" className="hover:text-green-200">
              My Orders
            </Link>
            <span className="text-sm">Hello, {user.email.split('@')[0]}</span>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded text-sm">Logout</button>
          </div>
        ) : (
          <Link href="/login" className="bg-white text-green-800 px-4 py-1 rounded font-semibold">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
