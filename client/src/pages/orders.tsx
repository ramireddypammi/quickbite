import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Clock, Utensils, Truck, Home } from 'lucide-react';
import { type Order } from '@shared/schema';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-context';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <CheckCircle className="w-5 h-5 text-success" />;
    case 'preparing':
      return <Utensils className="w-5 h-5 text-primary animate-pulse" />;
    case 'out_for_delivery':
      return <Truck className="w-5 h-5 text-blue-500" />;
    case 'delivered':
      return <Home className="w-5 h-5 text-success" />;
    default:
      return <Clock className="w-5 h-5 text-gray-400" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Order Placed';
    case 'confirmed':
      return 'Order Confirmed';
    case 'preparing':
      return 'Preparing your food';
    case 'out_for_delivery':
      return 'Out for delivery';
    case 'delivered':
      return 'Delivered';
    default:
      return status;
  }
};

export default function Orders() {
  const { auth } = useAuth();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/users', auth.user?.id, 'orders'],
    enabled: !!auth.user?.id,
  });

  // Mock order for demonstration since we're using in-memory storage
  const mockOrder: Order = {
    id: '12345',
    userId: auth.user?.id || '',
    restaurantId: '2',
    status: 'preparing',
    totalAmount: '58.28',
    deliveryAddress: '123 Main Street, Downtown, NY 10001',
    paymentMethod: 'razorpay',
    paymentStatus: 'completed',
    createdAt: new Date(),
  };

  const displayOrders = orders && orders.length > 0 ? orders : [mockOrder];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : displayOrders.length > 0 ? (
            <div className="space-y-6">
              {displayOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <span data-testid={`text-order-id-${order.id}`}>Order #{order.id}</span>
                      </CardTitle>
                      <div className="text-sm text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Order Status Timeline */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Order Status</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-success" />
                            <div>
                              <p className="font-medium text-gray-900">Order Placed</p>
                              <p className="text-sm text-gray-500">2:45 PM</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-success" />
                            <div>
                              <p className="font-medium text-gray-900">Order Confirmed</p>
                              <p className="text-sm text-gray-500">2:47 PM</p>
                            </div>
                          </div>

                          <div className={`flex items-center space-x-3 ${
                            order.status === 'preparing' ? '' : 'opacity-50'
                          }`}>
                            {getStatusIcon(order.status)}
                            <div>
                              <p className={`font-medium ${
                                order.status === 'preparing' ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {getStatusText(order.status)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {order.status === 'preparing' ? 'Estimated time: 15-20 minutes' : 'Pending'}
                              </p>
                            </div>
                          </div>

                          <div className={`flex items-center space-x-3 ${
                            ['out_for_delivery', 'delivered'].includes(order.status) ? '' : 'opacity-50'
                          }`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              order.status === 'out_for_delivery' ? 'bg-blue-500' : 'bg-gray-200'
                            }`}>
                              <Truck className={`w-3 h-3 ${
                                order.status === 'out_for_delivery' ? 'text-white' : 'text-gray-400'
                              }`} />
                            </div>
                            <div>
                              <p className={`font-medium ${
                                order.status === 'out_for_delivery' ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                Out for delivery
                              </p>
                              <p className="text-sm text-gray-400">Pending</p>
                            </div>
                          </div>

                          <div className={`flex items-center space-x-3 ${
                            order.status === 'delivered' ? '' : 'opacity-50'
                          }`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              order.status === 'delivered' ? 'bg-success' : 'bg-gray-200'
                            }`}>
                              <Home className={`w-3 h-3 ${
                                order.status === 'delivered' ? 'text-white' : 'text-gray-400'
                              }`} />
                            </div>
                            <div>
                              <p className={`font-medium ${
                                order.status === 'delivered' ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                Delivered
                              </p>
                              <p className="text-sm text-gray-400">Pending</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Details */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Delivery Details</h4>
                        <p className="text-sm text-gray-600 mb-1" data-testid={`text-delivery-address-${order.id}`}>
                          Delivering to: {order.deliveryAddress}
                        </p>
                        <p className="text-sm text-gray-600">
                          Estimated delivery: 3:05 PM - 3:15 PM
                        </p>
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Amount</span>
                            <span className="font-semibold text-gray-900" data-testid={`text-order-total-${order.id}`}>
                              ${order.totalAmount}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm text-gray-600">Payment Method</span>
                            <span className="text-sm text-gray-900 capitalize">
                              {order.paymentMethod}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
                <p className="text-sm text-gray-400">Start exploring restaurants and place your first order!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
