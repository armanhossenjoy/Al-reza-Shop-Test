'use client'
import { useCart } from '../../context/CartContext'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CartPage() {
  const { cart, removeFromCart, clearCart, cartTotal } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    // 1. Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    // 2. Create the Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ user_id: user.id, total_amount: cartTotal })
      .select()
      .single()

    if (orderError) {
      alert('Error creating order: ' + orderError.message)
      setLoading(false)
      return
    }

    // 3. Add items to the order
    const orderItems = cart.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      alert('Error adding items: ' + itemsError.message)
    } else {
      alert('Order placed successfully!')
      clearCart()
      router.push('/')
    }
    setLoading(false)
  }

  if (cart.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl">Your cart is empty</h2>
        <Link href="/" className="text-green-600 underline mt-4 block">Go Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Shopping Cart</h1>
      
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b border-gray-100 py-6 last:border-0">
            <div>
              <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-900">{item.quantity}</span> x ${item.price}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-lg text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 text-sm hover:text-red-700 font-medium transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        
        <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
          <span className="text-xl font-bold text-gray-700">Total Amount</span>
          <span className="text-3xl font-bold text-green-900">${cartTotal.toFixed(2)}</span>
        </div>

        <button 
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-green-900 text-white py-4 rounded-xl mt-8 hover:bg-green-800 disabled:bg-gray-400 font-bold text-lg transition-all shadow-md hover:shadow-lg"
        >
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  )
}
