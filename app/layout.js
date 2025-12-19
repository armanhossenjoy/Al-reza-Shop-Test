import './globals.css'
import { CartProvider } from '../context/CartContext'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'Al Reza Organic - Fresh & Healthy',
  description: 'Discover the finest organic products for a healthier lifestyle',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-green-50 to-emerald-100 text-gray-900 min-h-screen">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}

function Footer() {
  return (
    <footer className="bg-green-900 text-white py-12 mt-16">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🌿 Al Reza Organic</h3>
            <p className="text-green-200">Bringing nature's best to your doorstep since 2024.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-green-200 hover:text-white transition">Home</a></li>
              <li><a href="/cart" className="text-green-200 hover:text-white transition">Cart</a></li>
              <li><a href="/login" className="text-green-200 hover:text-white transition">Login</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li className="text-green-200">Fruits</li>
              <li className="text-green-200">Vegetables</li>
              <li className="text-green-200">Dairy</li>
              <li className="text-green-200">Grains</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-green-200">Email: info@alrezaorganic.com</p>
            <p className="text-green-200">Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="border-t border-green-800 mt-8 pt-8 text-center">
          <p className="text-green-200">&copy; 2025 Al Reza Organic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
