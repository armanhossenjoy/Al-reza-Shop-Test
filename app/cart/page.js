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
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b py-4">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">Qty: {item.quantity} x ${item.price}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        
        <div className="mt-6 flex justify-between items-center pt-4 border-t">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-2xl font-bold text-green-800">${cartTotal.toFixed(2)}</span>
        </div>

        <button 
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded mt-6 hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  )
}
