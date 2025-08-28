import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/lib/cart-context';
import { useLocation } from 'wouter';

export default function CartSidebar() {
  const { state, closeCart, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart();
  const [, setLocation] = useLocation();

  const deliveryFee = 2.99;
  const tax = getTotalPrice() * 0.08;
  const total = getTotalPrice() + deliveryFee + tax;

  const handleCheckout = () => {
    closeCart();
    setLocation('/checkout');
  };

  if (!state.isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
        data-testid="backdrop-cart"
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Your Order</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-lg"
              data-testid="button-close-cart"
            >
              <X className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-400">Add some delicious food to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <Card key={item.id} className="py-3 border-b border-gray-100">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900" data-testid={`text-cart-item-name-${item.id}`}>
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">From Restaurant</p>
                        <span className="text-primary font-semibold" data-testid={`text-cart-item-price-${item.id}`}>
                          ₹{item.price}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center" data-testid={`text-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Order Summary */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span data-testid="text-subtotal">₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span data-testid="text-delivery-fee">₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span data-testid="text-tax">₹{tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span data-testid="text-total">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Checkout Button */}
        {state.items.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <Button
              onClick={handleCheckout}
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors"
              data-testid="button-proceed-checkout"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
