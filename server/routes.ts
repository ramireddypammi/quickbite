import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertOrderSchema, insertOrderItemSchema, loginSchema, registerSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser({
        ...userData,
        role: "user"
      });
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          role: user.role,
          phone: user.phone,
          address: user.address
        } 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          role: user.role,
          phone: user.phone,
          address: user.address
        } 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Login failed" });
    }
  });

  // Get current user (for maintaining session)
  app.get("/api/auth/user", async (req, res) => {
    try {
      const userId = req.headers['user-id'] as string;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          role: user.role,
          phone: user.phone,
          address: user.address
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Restaurant routes
  app.get("/api/restaurants", async (req, res) => {
    try {
      const { category } = req.query;
      let restaurants;
      
      if (category && typeof category === "string") {
        restaurants = await storage.getRestaurantsByCategory(category);
      } else {
        restaurants = await storage.getAllRestaurants();
      }
      
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  });

  app.get("/api/restaurants/:id", async (req, res) => {
    try {
      const restaurant = await storage.getRestaurant(req.params.id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurant" });
    }
  });

  // Menu routes
  app.get("/api/restaurants/:id/menu", async (req, res) => {
    try {
      const menuItems = await storage.getMenuItemsByRestaurant(req.params.id);
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu" });
    }
  });

  app.get("/api/menu/:id", async (req, res) => {
    try {
      const menuItem = await storage.getMenuItem(req.params.id);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(menuItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu item" });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const { orderData, items } = req.body;
      const order = await storage.createOrder(insertOrderSchema.parse(orderData));
      
      // Create order items
      const orderItems = await Promise.all(
        items.map((item: any) => 
          storage.createOrderItem(insertOrderItemSchema.parse({
            orderId: order.id,
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          }))
        )
      );
      
      res.json({ order, items: orderItems });
    } catch (error) {
      res.status(400).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const items = await storage.getOrderItems(order.id);
      res.json({ order, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.get("/api/users/:id/orders", async (req, res) => {
    try {
      const orders = await storage.getOrdersByUser(req.params.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Payment routes (mocked Razorpay integration)
  app.post("/api/payment/create", async (req, res) => {
    try {
      const { amount, orderId } = req.body;
      
      // Mock Razorpay order creation
      const razorpayOrder = {
        id: `order_${Date.now()}`,
        amount: amount * 100, // Convert to paise
        currency: "USD",
        status: "created",
        orderId: orderId,
      };
      
      res.json(razorpayOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  app.post("/api/payment/verify", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, orderId } = req.body;
      
      // Mock payment verification
      const isValid = razorpay_order_id && razorpay_payment_id;
      
      if (isValid) {
        // Update order payment status
        const order = await storage.getOrder(orderId);
        if (order) {
          order.paymentStatus = "completed";
          order.status = "confirmed";
        }
        
        res.json({ success: true, message: "Payment verified successfully" });
      } else {
        res.status(400).json({ success: false, message: "Payment verification failed" });
      }
    } catch (error) {
      res.status(500).json({ message: "Payment verification failed" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const userRole = req.headers['user-role'] as string;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const restaurants = await storage.getAllRestaurants();
      const totalRestaurants = restaurants.length;
      const orders = await storage.getAllOrders();
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      
      const stats = {
        totalRestaurants,
        totalOrders,
        totalUsers: 0,
        totalRevenue: totalRevenue.toFixed(2)
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/orders", async (req, res) => {
    try {
      const userRole = req.headers['user-role'] as string;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const orders = await storage.getAllOrders();
      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          const restaurant = await storage.getRestaurant(order.restaurantId);
          const user = await storage.getUser(order.userId);
          const items = await storage.getOrderItems(order.id);
          return {
            ...order,
            restaurant: restaurant ? { id: restaurant.id, name: restaurant.name } : null,
            user: user ? { id: user.id, username: user.username } : null,
            itemCount: items.length
          };
        })
      );
      
      res.json(ordersWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.patch("/api/admin/orders/:id/status", async (req, res) => {
    try {
      const userRole = req.headers['user-role'] as string;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  app.get("/api/admin/restaurants", async (req, res) => {
    try {
      const userRole = req.headers['user-role'] as string;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const restaurants = await storage.getAllRestaurants();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  });

  app.post("/api/admin/restaurants", async (req, res) => {
    try {
      const userRole = req.headers['user-role'] as string;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const restaurant = await storage.createRestaurant(req.body);
      res.json(restaurant);
    } catch (error) {
      res.status(400).json({ message: "Failed to create restaurant" });
    }
  });

  app.post("/api/admin/menu-items", async (req, res) => {
    try {
      const userRole = req.headers['user-role'] as string;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const menuItem = await storage.createMenuItem(req.body);
      res.json(menuItem);
    } catch (error) {
      res.status(400).json({ message: "Failed to create menu item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
