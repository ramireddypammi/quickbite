import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type Restaurant } from '@shared/schema';
import Navbar from '@/components/navbar';
import CategoryFilter from '@/components/category-filter';
import RestaurantCard from '@/components/restaurant-card';
import CartSidebar from '@/components/cart-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: restaurants, isLoading } = useQuery<Restaurant[]>({
    queryKey: ['/api/restaurants', selectedCategory],
    queryFn: async () => {
      const url = selectedCategory 
        ? `/api/restaurants?category=${encodeURIComponent(selectedCategory)}`
        : '/api/restaurants';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      return response.json();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-16 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Delicious food,<br />delivered fast
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              Order from your favorite restaurants and get food delivered to your doorstep in minutes.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                className="bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                data-testid="button-order-now"
              >
                Order Now
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-primary transition-colors"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <CategoryFilter 
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      {/* Restaurant Listing */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory ? `${selectedCategory} Restaurants` : 'Popular Restaurants'}
            </h2>
            <div className="flex items-center space-x-4">
              <select 
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="select-sort"
              >
                <option>Sort by: Popularity</option>
                <option>Rating</option>
                <option>Delivery Time</option>
                <option>Price Range</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="bg-white rounded-xl shadow-sm">
                  <CardContent className="p-0">
                    <Skeleton className="w-full h-48 rounded-t-xl" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : restaurants && restaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No restaurants found</p>
              <Button 
                onClick={() => setSelectedCategory(null)}
                variant="outline"
                data-testid="button-view-all"
              >
                View All Restaurants
              </Button>
            </div>
          )}

          {restaurants && restaurants.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                className="bg-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                data-testid="button-view-all-restaurants"
              >
                View All Restaurants
              </Button>
            </div>
          )}
        </div>
      </section>

      <CartSidebar />
    </div>
  );
}
