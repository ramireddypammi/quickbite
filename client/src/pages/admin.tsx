import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, BarChart3, Store, Users, DollarSign, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import type { Restaurant } from '@shared/schema';

const restaurantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  cuisine: z.string().min(1, 'Cuisine is required'),
  image: z.string().url('Must be a valid URL'),
  deliveryTime: z.string().min(1, 'Delivery time is required'),
  deliveryFee: z.string().min(1, 'Delivery fee is required'),
});

const menuItemSchema = z.object({
  restaurantId: z.string().min(1, 'Restaurant is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required'),
  image: z.string().url('Must be a valid URL'),
  category: z.string().min(1, 'Category is required'),
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;
type MenuItemFormData = z.infer<typeof menuItemSchema>;

export default function Admin() {
  const { auth, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRestaurantDialogOpen, setIsRestaurantDialogOpen] = useState(false);
  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false);

  // Check if user is admin
  if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500 mb-4">Access denied. Admin privileges required.</p>
            <Button onClick={() => setLocation('/login')} data-testid="button-login">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      return apiRequest('GET', '/api/admin/stats', undefined, {
        'user-id': auth.user!.id,
        'user-role': auth.user!.role,
      });
    },
  });

  const { data: restaurants } = useQuery<Restaurant[]>({
    queryKey: ['/api/admin/restaurants'],
    queryFn: async () => {
      return apiRequest('GET', '/api/admin/restaurants', undefined, {
        'user-id': auth.user!.id,
        'user-role': auth.user!.role,
      });
    },
  });

  const restaurantForm = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: '',
      description: '',
      cuisine: '',
      image: '',
      deliveryTime: '',
      deliveryFee: '',
    },
  });

  const menuItemForm = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      restaurantId: '',
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
    },
  });

  const createRestaurantMutation = useMutation({
    mutationFn: async (data: RestaurantFormData) => {
      return apiRequest('POST', '/api/admin/restaurants', data, {
        'user-id': auth.user!.id,
        'user-role': auth.user!.role,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setIsRestaurantDialogOpen(false);
      restaurantForm.reset();
      toast({
        title: 'Restaurant created!',
        description: 'New restaurant has been added successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create restaurant.',
        variant: 'destructive',
      });
    },
  });

  const createMenuItemMutation = useMutation({
    mutationFn: async (data: MenuItemFormData) => {
      return apiRequest('POST', '/api/admin/menu-items', data, {
        'user-id': auth.user!.id,
        'user-role': auth.user!.role,
      });
    },
    onSuccess: () => {
      setIsMenuItemDialogOpen(false);
      menuItemForm.reset();
      toast({
        title: 'Menu item created!',
        description: 'New menu item has been added successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create menu item.',
        variant: 'destructive',
      });
    },
  });

  const handleLogout = () => {
    logout();
    setLocation('/');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">QuickBite Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {auth.user?.username}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('dashboard')}
              data-testid="tab-dashboard"
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Dashboard
            </button>
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'restaurants'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('restaurants')}
              data-testid="tab-restaurants"
            >
              <Store className="w-4 h-4 inline mr-2" />
              Restaurants
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-restaurants">
                  {stats?.totalRestaurants || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-orders">
                  {stats?.totalOrders || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-users">
                  {stats?.totalUsers || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-revenue">
                  ${stats?.totalRevenue || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Restaurants Tab */}
        {activeTab === 'restaurants' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Restaurants</h2>
              <div className="space-x-2">
                <Dialog open={isRestaurantDialogOpen} onOpenChange={setIsRestaurantDialogOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-restaurant">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Restaurant
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Restaurant</DialogTitle>
                    </DialogHeader>
                    <Form {...restaurantForm}>
                      <form
                        onSubmit={restaurantForm.handleSubmit((data) => createRestaurantMutation.mutate(data))}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={restaurantForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Restaurant Name</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-restaurant-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={restaurantForm.control}
                            name="cuisine"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cuisine Type</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-restaurant-cuisine" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={restaurantForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea {...field} data-testid="input-restaurant-description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={restaurantForm.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://..." data-testid="input-restaurant-image" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={restaurantForm.control}
                            name="deliveryTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Delivery Time</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="20-30 min" data-testid="input-restaurant-delivery-time" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={restaurantForm.control}
                            name="deliveryFee"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Delivery Fee ($)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="2.99" data-testid="input-restaurant-delivery-fee" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsRestaurantDialogOpen(false)}
                            data-testid="button-cancel-restaurant"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={createRestaurantMutation.isPending}
                            data-testid="button-save-restaurant"
                          >
                            {createRestaurantMutation.isPending ? 'Creating...' : 'Create Restaurant'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isMenuItemDialogOpen} onOpenChange={setIsMenuItemDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" data-testid="button-add-menu-item">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Menu Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Menu Item</DialogTitle>
                    </DialogHeader>
                    <Form {...menuItemForm}>
                      <form
                        onSubmit={menuItemForm.handleSubmit((data) => createMenuItemMutation.mutate(data))}
                        className="space-y-4"
                      >
                        <FormField
                          control={menuItemForm.control}
                          name="restaurantId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Restaurant</FormLabel>
                              <FormControl>
                                <select
                                  {...field}
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                  data-testid="select-restaurant"
                                >
                                  <option value="">Select a restaurant</option>
                                  {restaurants?.map((restaurant) => (
                                    <option key={restaurant.id} value={restaurant.id}>
                                      {restaurant.name}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={menuItemForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Item Name</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-menu-item-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={menuItemForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-menu-item-category" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={menuItemForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea {...field} data-testid="input-menu-item-description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={menuItemForm.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="12.99" data-testid="input-menu-item-price" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={menuItemForm.control}
                            name="image"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://..." data-testid="input-menu-item-image" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsMenuItemDialogOpen(false)}
                            data-testid="button-cancel-menu-item"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={createMenuItemMutation.isPending}
                            data-testid="button-save-menu-item"
                          >
                            {createMenuItemMutation.isPending ? 'Creating...' : 'Create Menu Item'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Restaurant List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants?.map((restaurant) => (
                <Card key={restaurant.id} data-testid={`card-admin-restaurant-${restaurant.id}`}>
                  <CardContent className="p-0">
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{restaurant.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{restaurant.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">{restaurant.cuisine}</span>
                        <span className="text-primary font-medium">${restaurant.deliveryFee} delivery</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}