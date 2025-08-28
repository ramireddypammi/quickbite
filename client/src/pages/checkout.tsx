import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { CreditCard, Smartphone, Banknote, Lock, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const checkoutSchema = z.object({
  streetAddress: z.string().min(1, 'Street address is required'),
  apartment: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  paymentMethod: z.enum(['card', 'razorpay', 'cod']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { state: cartState, clearCart } = useCart();
  const { auth } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      streetAddress: '',
      apartment: '',
      city: '',
      zipCode: '',
      paymentMethod: 'razorpay',
    },
  });

  const deliveryFee = 2.99;
  const subtotal = cartState.items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return apiRequest('POST', '/api/orders', orderData);
    },
    onSuccess: () => {
      clearCart();
      setLocation('/orders');
      toast({
        title: 'Order placed successfully!',
        description: 'Your order has been confirmed and is being prepared.',
      });
    },
    onError: () => {
      toast({
        title: 'Order failed',
        description: 'There was an error placing your order. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handlePlaceOrder = async (data: CheckoutFormData) => {
    if (!auth.isAuthenticated) {
      toast({
        title: 'Please log in',
        description: 'You need to log in to place an order.',
        variant: 'destructive',
      });
      return;
    }

    if (cartState.items.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Please add items to your cart before placing an order.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Mock payment processing for Razorpay
      if (data.paymentMethod === 'razorpay') {
        const paymentResponse = await apiRequest('POST', '/api/payment/create', {
          amount: total,
          orderId: `temp_${Date.now()}`,
        });

        // Simulate payment success
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await apiRequest('POST', '/api/payment/verify', {
          razorpay_order_id: 'order_mock_123',
          razorpay_payment_id: 'pay_mock_456',
          orderId: 'temp_order',
        });
      }

      // Create the order
      const orderData = {
        orderData: {
          userId: auth.user!.id,
          restaurantId: cartState.items[0]?.restaurantId || '1',
          totalAmount: total.toString(),
          deliveryAddress: `${data.streetAddress}, ${data.apartment ? data.apartment + ', ' : ''}${data.city}, ${data.zipCode}`,
          paymentMethod: data.paymentMethod,
        },
        items: cartState.items.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await createOrderMutation.mutateAsync(orderData);
    } catch (error) {
      console.error('Order placement error:', error);
      toast({
        title: 'Payment failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button onClick={() => setLocation('/')} data-testid="button-continue-shopping">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation('/')}
              className="mr-4"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery & Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handlePlaceOrder)} className="space-y-6">
                    {/* Delivery Address */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="streetAddress"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main Street" {...field} data-testid="input-street-address" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="apartment"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Apartment/Suite (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Apt 4B" {...field} data-testid="input-apartment" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="New York" {...field} data-testid="input-city" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="10001" {...field} data-testid="input-zip" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-3"
                              >
                                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                  <RadioGroupItem value="card" id="card" data-testid="radio-card" />
                                  <CreditCard className="w-5 h-5 text-gray-600" />
                                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                                    Credit/Debit Card
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                  <RadioGroupItem value="razorpay" id="razorpay" data-testid="radio-razorpay" />
                                  <Smartphone className="w-5 h-5 text-gray-600" />
                                  <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                                    Razorpay (UPI, Wallets, Banking)
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                  <RadioGroupItem value="cod" id="cod" data-testid="radio-cod" />
                                  <Banknote className="w-5 h-5 text-gray-600" />
                                  <Label htmlFor="cod" className="flex-1 cursor-pointer">
                                    Cash on Delivery
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary text-white font-semibold py-4 rounded-lg hover:bg-primary-dark transition-colors text-lg"
                      disabled={isProcessing}
                      data-testid="button-place-order"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {isProcessing ? 'Processing...' : `Place Order - ₹${total.toFixed(2)}`}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <span>{item.quantity}x {item.name}</span>
                      <span data-testid={`text-item-total-${item.id}`}>
                        ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span data-testid="text-checkout-subtotal">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span data-testid="text-checkout-delivery">₹{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span data-testid="text-checkout-tax">₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span data-testid="text-checkout-total">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
