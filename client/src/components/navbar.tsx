import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, MapPin, ShoppingCart, ChevronDown, Utensils, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';

export default function Navbar() {
  const { state: cartState, openCart } = useCart();
  const { auth, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState('Hyderabad, Telangana');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState('');

  // Load location from localStorage on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setUserLocation(savedLocation);
    }
  }, []);

  // Save location to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userLocation', userLocation);
  }, [userLocation]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const handleLocationEdit = () => {
    setIsEditingLocation(true);
    setTempLocation(userLocation);
    // Auto-focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      const desktopInput = document.querySelector('[data-testid="input-location"]') as HTMLInputElement;
      const mobileInput = document.querySelector('[data-testid="input-location-mobile"]') as HTMLInputElement;
      if (desktopInput) desktopInput.focus();
      if (mobileInput) mobileInput.focus();
    }, 100);
  };

  const handleLocationSave = () => {
    if (tempLocation.trim()) {
      setUserLocation(tempLocation.trim());
      setIsEditingLocation(false);
      toast({
        title: "Location updated",
        description: `Your delivery location has been set to ${tempLocation.trim()}`,
      });
    }
  };

  const handleLocationCancel = () => {
    setIsEditingLocation(false);
    setTempLocation('');
  };

  const handleLocationKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLocationSave();
    } else if (e.key === 'Escape') {
      handleLocationCancel();
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Utensils className="text-white text-lg" />
            </div>
            <span className="text-2xl font-bold text-gray-900">QuickBite X RamiReddy</span>
          </Link>

          {/* Location Selector */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-50 rounded-lg px-4 py-2">
            <MapPin className="text-primary w-4 h-4" />
            {isEditingLocation ? (
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  onKeyDown={handleLocationKeyDown}
                  placeholder="Enter your location"
                  className="w-32 h-6 text-sm border-0 bg-transparent p-0 focus:ring-0 focus:outline-none"
                  data-testid="input-location"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleLocationSave}
                  className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                  data-testid="button-save-location"
                >
                  ✓
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleLocationCancel}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  data-testid="button-cancel-location"
                >
                  ✕
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span 
                  className="text-sm text-gray-700 cursor-pointer" 
                  data-testid="text-user-location"
                  title="Click the edit button to change your delivery location"
                >
                  {userLocation}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleLocationEdit}
                  className="h-6 w-6 p-0 text-gray-500 hover:text-primary transition-colors"
                  data-testid="button-edit-location"
                  title="Edit delivery location"
                >
                  ✎
                </Button>
              </div>
            )}
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

          {/* Mobile Search and Location */}
          <div className="lg:hidden flex-1 mx-4">
            <div className="space-y-2">
              {/* Mobile Search */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search restaurants, cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  data-testid="input-search-mobile"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              
              {/* Mobile Location */}
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                <MapPin className="text-primary w-4 h-4" />
                {isEditingLocation ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <Input
                      type="text"
                      value={tempLocation}
                      onChange={(e) => setTempLocation(e.target.value)}
                      onKeyDown={handleLocationKeyDown}
                      placeholder="Enter your location"
                      className="flex-1 h-6 text-sm border-0 bg-transparent p-0 focus:ring-0 focus:outline-none"
                      data-testid="input-location-mobile"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleLocationSave}
                      className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                      data-testid="button-save-location-mobile"
                    >
                      ✓
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleLocationCancel}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      data-testid="button-cancel-location-mobile"
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 flex-1">
                    <span 
                      className="text-sm text-gray-700 flex-1 cursor-pointer" 
                      data-testid="text-user-location-mobile"
                      title="Click the edit button to change your delivery location"
                    >
                      {userLocation}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleLocationEdit}
                      className="h-6 w-6 p-0 text-gray-500 hover:text-primary transition-colors"
                      data-testid="button-edit-location-mobile"
                      title="Edit delivery location"
                    >
                      ✎
                    </Button>
                  </div>
                )}
              </div>
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
            {auth.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2" data-testid="button-user-menu">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="hidden md:block text-sm text-gray-700" data-testid="text-username">
                      {auth.user?.username}
                    </span>
                    <ChevronDown className="text-xs text-gray-500 w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center cursor-pointer" data-testid="link-orders">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  {auth.user?.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center cursor-pointer" data-testid="link-admin">
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 cursor-pointer"
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  asChild 
                  size="sm"
                  data-testid="button-login"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button 
                  size="sm" 
                  asChild
                  data-testid="button-signup"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
