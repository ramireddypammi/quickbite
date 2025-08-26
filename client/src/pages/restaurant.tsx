import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Star, Clock, ArrowLeft } from 'lucide-react';
import { type Restaurant, type MenuItem } from '@shared/schema';
import Navbar from '@/components/navbar';
import MenuItemComponent from '@/components/menu-item';
import CartSidebar from '@/components/cart-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocation } from 'wouter';
import { useState } from 'react';

export default function Restaurant() {
  const [, params] = useRoute('/restaurant/:id');
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('Popular Items');
  
  const restaurantId = params?.id;

  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery<Restaurant>({
    queryKey: ['/api/restaurants', restaurantId],
    enabled: !!restaurantId,
  });

  const { data: menuItems, isLoading: isLoadingMenu } = useQuery<MenuItem[]>({
    queryKey: ['/api/restaurants', restaurantId, 'menu'],
    enabled: !!restaurantId,
  });

  if (!restaurantId) {
    return <div>Restaurant not found</div>;
  }

  const categories = menuItems ? [...new Set(menuItems.map(item => item.category))] : [];
  const filteredItems = menuItems?.filter(item => 
    selectedCategory === 'Popular Items' || item.category === selectedCategory
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {isLoadingRestaurant ? (
        <div className="relative">
          <Skeleton className="h-64 w-full" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
      ) : restaurant ? (
        <div className="relative">
          <div 
            className="h-64 bg-cover bg-center"
            style={{
              backgroundImage: `url(${restaurant.image})`
            }}
          >
            <div className="absolute inset-0 bg-black opacity-40"></div>
          </div>
          <div className="absolute top-4 left-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-gray-50"
              onClick={() => setLocation('/')}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h2 className="text-3xl font-bold text-white mb-2" data-testid="text-restaurant-name">
              {restaurant.name}
            </h2>
            <div className="flex items-center text-white space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span data-testid="text-restaurant-rating">{restaurant.rating} reviews</span>
              </div>
              <span data-testid="text-restaurant-cuisine">{restaurant.cuisine}</span>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span data-testid="text-restaurant-delivery-time">{restaurant.deliveryTime}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Menu Categories */}
      <div className="sticky top-16 bg-white border-b border-gray-200 px-6 py-4 z-40">
        <div className="container mx-auto">
          <div className="flex space-x-6 overflow-x-auto">
            <button
              className={`pb-2 whitespace-nowrap transition-colors ${
                selectedCategory === 'Popular Items'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
              onClick={() => setSelectedCategory('Popular Items')}
              data-testid="button-category-popular"
            >
              Popular Items
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`pb-2 whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
                onClick={() => setSelectedCategory(category)}
                data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6" data-testid="text-category-title">
          {selectedCategory}
        </h3>
        
        {isLoadingMenu ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="py-4">
                <CardContent className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-20 h-20 rounded-lg" />
                    <Skeleton className="w-24 h-10 rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <MenuItemComponent key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found in this category</p>
          </div>
        )}
      </div>

      <CartSidebar />
    </div>
  );
}
