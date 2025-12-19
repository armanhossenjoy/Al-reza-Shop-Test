import './globals.css'
import { CartProvider } from '../context/CartContext'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'Al Reza Organic',
  description: 'Best organic food store',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  )
}
