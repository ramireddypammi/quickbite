import { Star, Clock, Heart } from 'lucide-react';
import { Restaurant } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [, setLocation] = useLocation();

  const handleViewRestaurant = () => {
    setLocation(`/restaurant/${restaurant.id}`);
  };

  return (
    <Card 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onClick={handleViewRestaurant}
      data-testid={`card-restaurant-${restaurant.id}`}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={restaurant.image} 
            alt={`${restaurant.name} restaurant`}
            className="w-full h-48 object-cover rounded-t-xl"
          />
          <div className="absolute top-3 left-3">
            {parseFloat(restaurant.deliveryFee) === 0 ? (
              <span className="bg-success text-white text-xs font-medium px-2 py-1 rounded-full">
                FREE DELIVERY
              </span>
            ) : parseFloat(restaurant.rating) > 4.8 ? (
              <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
                20% OFF
              </span>
            ) : null}
          </div>
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                // Toggle favorite functionality can be added here
              }}
              data-testid={`button-favorite-${restaurant.id}`}
            >
              <Heart className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 
              className="font-semibold text-gray-900 group-hover:text-primary transition-colors"
              data-testid={`text-restaurant-name-${restaurant.id}`}
            >
              {restaurant.name}
            </h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700" data-testid={`text-rating-${restaurant.id}`}>
                {restaurant.rating}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3" data-testid={`text-cuisine-${restaurant.id}`}>
            {restaurant.cuisine} • {restaurant.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center" data-testid={`text-delivery-time-${restaurant.id}`}>
              <Clock className="w-4 h-4 mr-1" />
              {restaurant.deliveryTime}
            </span>
            <span className="text-gray-600" data-testid={`text-delivery-fee-${restaurant.id}`}>
              ₹{restaurant.deliveryFee} delivery
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
