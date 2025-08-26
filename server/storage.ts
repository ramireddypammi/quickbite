import { type User, type InsertUser, type Restaurant, type InsertRestaurant, type MenuItem, type InsertMenuItem, type Order, type InsertOrder, type OrderItem, type InsertOrderItem, users, restaurants, menuItems, orders, orderItems } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Restaurant methods
  getAllRestaurants(): Promise<Restaurant[]>;
  getRestaurant(id: string): Promise<Restaurant | undefined>;
  getRestaurantsByCategory(cuisine: string): Promise<Restaurant[]>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  
  // Menu methods
  getMenuItemsByRestaurant(restaurantId: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  
  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  
  // Order items
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.seedData();
  }

  private async seedData() {
    // Check if restaurants already exist
    const existingRestaurants = await db.select().from(restaurants).limit(1);
    if (existingRestaurants.length > 0) return;

    // Seed restaurants
    const restaurantData = [
      {
        id: "1",
        name: "Burger Palace",
        description: "Delicious gourmet burgers and fries",
        cuisine: "American",
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: "4.8",
        deliveryTime: "25-35 min",
        deliveryFee: "3.99",
        isActive: true,
      },
      {
        id: "2",
        name: "Mario's Pizzeria",
        description: "Authentic Italian pizza and pasta",
        cuisine: "Italian",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: "4.9",
        deliveryTime: "20-30 min",
        deliveryFee: "2.99",
        isActive: true,
      },
      {
        id: "3",
        name: "Green Garden Cafe",
        description: "Fresh healthy salads and bowls",
        cuisine: "Healthy",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: "4.7",
        deliveryTime: "15-25 min",
        deliveryFee: "4.99",
        isActive: true,
      },
      {
        id: "4",
        name: "Tokyo Sushi Bar",
        description: "Premium sushi and Japanese cuisine",
        cuisine: "Japanese",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: "4.6",
        deliveryTime: "30-40 min",
        deliveryFee: "5.99",
        isActive: true,
      },
    ];

    await db.insert(restaurants).values(restaurantData);

    // Seed menu items
    const menuItemsData = [
      // Burger Palace items
      {
        id: "1",
        restaurantId: "1",
        name: "Classic Burger",
        description: "Beef patty, lettuce, tomato, cheese, and special sauce",
        price: "12.99",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Burgers",
        isAvailable: true,
      },
      {
        id: "2",
        restaurantId: "1",
        name: "BBQ Bacon Burger",
        description: "BBQ sauce, bacon, onion rings, and cheddar cheese",
        price: "15.99",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Burgers",
        isAvailable: true,
      },
      // Mario's Pizzeria items
      {
        id: "3",
        restaurantId: "2",
        name: "Margherita Pizza",
        description: "Fresh mozzarella, tomato sauce, basil, olive oil",
        price: "18.99",
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Pizza",
        isAvailable: true,
      },
      {
        id: "4",
        restaurantId: "2",
        name: "Pepperoni Pizza",
        description: "Pepperoni, mozzarella cheese, tomato sauce",
        price: "21.99",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Pizza",
        isAvailable: true,
      },
      {
        id: "5",
        restaurantId: "2",
        name: "Caesar Salad",
        description: "Romaine lettuce, parmesan cheese, croutons, caesar dressing",
        price: "12.99",
        image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Salads",
        isAvailable: true,
      },
      // Green Garden Cafe items
      {
        id: "6",
        restaurantId: "3",
        name: "Buddha Bowl",
        description: "Quinoa, avocado, roasted vegetables, tahini dressing",
        price: "14.99",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Bowls",
        isAvailable: true,
      },
      {
        id: "7",
        restaurantId: "3",
        name: "Green Smoothie",
        description: "Spinach, banana, mango, coconut water",
        price: "8.99",
        image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Beverages",
        isAvailable: true,
      },
      // Tokyo Sushi Bar items
      {
        id: "8",
        restaurantId: "4",
        name: "Salmon Roll",
        description: "Fresh salmon, avocado, cucumber",
        price: "16.99",
        image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Sushi",
        isAvailable: true,
      },
      {
        id: "9",
        restaurantId: "4",
        name: "Tuna Sashimi",
        description: "Fresh tuna slices with wasabi and ginger",
        price: "22.99",
        image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Sashimi",
        isAvailable: true,
      },
    ];

    await db.insert(menuItems).values(menuItemsData);

    // Create default admin user
    const adminPassword = "admin123"; // In production, this should be hashed
    await db.insert(users).values({
      id: "admin-1",
      username: "admin",
      email: "admin@quickbite.com",
      password: adminPassword,
      role: "admin",
      phone: "+1234567890",
      address: "QuickBite HQ",
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    return db.select().from(restaurants).where(eq(restaurants.isActive, true));
  }

  async getRestaurant(id: string): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return restaurant;
  }

  async getRestaurantsByCategory(cuisine: string): Promise<Restaurant[]> {
    return db.select().from(restaurants)
      .where(eq(restaurants.cuisine, cuisine));
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const [restaurant] = await db.insert(restaurants).values(insertRestaurant).returning();
    return restaurant;
  }

  async getMenuItemsByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    return db.select().from(menuItems)
      .where(eq(menuItems.restaurantId, restaurantId));
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    const [menuItem] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return menuItem;
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const [menuItem] = await db.insert(menuItems).values(insertMenuItem).returning();
    return menuItem;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.userId, userId));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [order] = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await db.insert(orderItems).values(insertOrderItem).returning();
    return orderItem;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private restaurants: Map<string, Restaurant>;
  private menuItems: Map<string, MenuItem>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;

  constructor() {
    this.users = new Map();
    this.restaurants = new Map();
    this.menuItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    
    this.seedData();
  }

  private seedData() {
    // Seed restaurants
    const restaurants = [
      {
        id: "1",
        name: "Burger Palace",
        description: "Delicious gourmet burgers and fries",
        cuisine: "American",
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: "4.8",
        deliveryTime: "25-35 min",
        deliveryFee: "3.99",
        isActive: true,
      },
      {
        id: "2",
        name: "Mario's Pizzeria",
        description: "Authentic Italian pizza and pasta",
        cuisine: "Italian",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: "4.9",
        deliveryTime: "20-30 min",
        deliveryFee: "2.99",
        isActive: true,
      },
      {
        id: "3",
        name: "Green Garden Cafe",
        description: "Fresh healthy salads and bowls",
        cuisine: "Healthy",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: "4.7",
        deliveryTime: "15-25 min",
        deliveryFee: "4.99",
        isActive: true,
      },
      {
        id: "4",
        name: "Tokyo Sushi Bar",
        description: "Premium sushi and Japanese cuisine",
        cuisine: "Japanese",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: "4.6",
        deliveryTime: "30-40 min",
        deliveryFee: "5.99",
        isActive: true,
      },
    ];

    restaurants.forEach(restaurant => {
      this.restaurants.set(restaurant.id, restaurant as Restaurant);
    });

    // Seed menu items
    const menuItems = [
      // Burger Palace items
      {
        id: "1",
        restaurantId: "1",
        name: "Classic Burger",
        description: "Beef patty, lettuce, tomato, cheese, and special sauce",
        price: "12.99",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Burgers",
        isAvailable: true,
      },
      {
        id: "2",
        restaurantId: "1",
        name: "BBQ Bacon Burger",
        description: "BBQ sauce, bacon, onion rings, and cheddar cheese",
        price: "15.99",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Burgers",
        isAvailable: true,
      },
      // Mario's Pizzeria items
      {
        id: "3",
        restaurantId: "2",
        name: "Margherita Pizza",
        description: "Fresh mozzarella, tomato sauce, basil, olive oil",
        price: "18.99",
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Pizza",
        isAvailable: true,
      },
      {
        id: "4",
        restaurantId: "2",
        name: "Pepperoni Pizza",
        description: "Pepperoni, mozzarella cheese, tomato sauce",
        price: "21.99",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Pizza",
        isAvailable: true,
      },
      {
        id: "5",
        restaurantId: "2",
        name: "Caesar Salad",
        description: "Romaine lettuce, parmesan cheese, croutons, caesar dressing",
        price: "12.99",
        image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Salads",
        isAvailable: true,
      },
      // Green Garden Cafe items
      {
        id: "6",
        restaurantId: "3",
        name: "Buddha Bowl",
        description: "Quinoa, avocado, roasted vegetables, tahini dressing",
        price: "14.99",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Bowls",
        isAvailable: true,
      },
      {
        id: "7",
        restaurantId: "3",
        name: "Green Smoothie",
        description: "Spinach, banana, mango, coconut water",
        price: "8.99",
        image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Beverages",
        isAvailable: true,
      },
      // Tokyo Sushi Bar items
      {
        id: "8",
        restaurantId: "4",
        name: "Salmon Roll",
        description: "Fresh salmon, avocado, cucumber",
        price: "16.99",
        image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Sushi",
        isAvailable: true,
      },
      {
        id: "9",
        restaurantId: "4",
        name: "Tuna Sashimi",
        description: "Fresh tuna slices with wasabi and ginger",
        price: "22.99",
        image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        category: "Sashimi",
        isAvailable: true,
      },
    ];

    menuItems.forEach(item => {
      this.menuItems.set(item.id, item as MenuItem);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values()).filter(r => r.isActive);
  }

  async getRestaurant(id: string): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async getRestaurantsByCategory(cuisine: string): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values()).filter(r => 
      r.isActive && r.cuisine.toLowerCase() === cuisine.toLowerCase()
    );
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const id = randomUUID();
    const restaurant: Restaurant = { ...insertRestaurant, id, isActive: true };
    this.restaurants.set(id, restaurant);
    return restaurant;
  }

  async getMenuItemsByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => 
      item.restaurantId === restaurantId && item.isAvailable
    );
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const id = randomUUID();
    const menuItem: MenuItem = { ...insertMenuItem, id, isAvailable: true };
    this.menuItems.set(id, menuItem);
    return menuItem;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id, 
      status: "pending", 
      paymentStatus: "pending",
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      this.orders.set(id, order);
      return order;
    }
    return undefined;
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }
}

export const storage = new DatabaseStorage();
