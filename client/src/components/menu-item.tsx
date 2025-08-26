import { MenuItem } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';
import { Check, Plus } from 'lucide-react';

interface MenuItemProps {
  item: MenuItem;
}

export default function MenuItemComponent({ item }: MenuItemProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Card className="flex items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <CardContent className="flex-1 p-0">
        <h4 className="font-semibold text-gray-900 mb-1" data-testid={`text-item-name-${item.id}`}>
          {item.name}
        </h4>
        <p className="text-sm text-gray-600 mb-2" data-testid={`text-item-description-${item.id}`}>
          {item.description}
        </p>
        <span className="text-lg font-bold text-primary" data-testid={`text-item-price-${item.id}`}>
          ${item.price}
        </span>
      </CardContent>
      <div className="flex items-center space-x-4 ml-4">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
          data-testid={`img-item-${item.id}`}
        />
        <Button
          onClick={handleAddToCart}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isAdded 
              ? 'bg-success hover:bg-success' 
              : 'bg-primary hover:bg-primary-dark'
          } text-white`}
          data-testid={`button-add-to-cart-${item.id}`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Added!
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
