'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'

export default function Home() {
  const [products, setProducts] = useState([])
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      let { data, error } = await supabase.from('products').select('*')
      if (data) setProducts(data)
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-green-900 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Fresh. Organic. Natural.</h1>
        <p className="text-green-100 text-lg max-w-2xl mx-auto">
          Premium organic products delivered directly from our farm to your table. Experience the taste of nature.
        </p>
      </div>

      <div className="container mx-auto p-8 -mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col">
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-800 shadow-sm">
                  {product.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <span className="text-2xl font-bold text-green-700">${product.price}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-green-900 text-white px-5 py-2.5 rounded-xl hover:bg-green-800 transition-colors shadow-sm font-medium active:scale-95 transform"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
