import { useState } from 'react';
import { Link } from 'wouter';
import { Search, MapPin, ShoppingCart, ChevronDown, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

export default function Navbar() {
  const { state: cartState, openCart } = useCart();
  const { auth } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Utensils className="text-white text-lg" />
            </div>
            <span className="text-2xl font-bold text-gray-900">QuickBite</span>
          </Link>

          {/* Location Selector */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-50 rounded-lg px-4 py-2">
            <MapPin className="text-primary w-4 h-4" />
            <span className="text-sm text-gray-700">Downtown, New York</span>
            <ChevronDown className="text-xs text-gray-500 w-3 h-3" />
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search restaurants, cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 text-gray-600 hover:text-primary transition-colors"
              onClick={openCart}
              data-testid="button-cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartState.items.length > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  data-testid="text-cart-count"
                >
                  {cartState.items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <span className="hidden md:block text-sm text-gray-700" data-testid="text-username">
                {auth.isAuthenticated ? auth.user?.username : 'Guest'}
              </span>
              <ChevronDown className="text-xs text-gray-500 w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
