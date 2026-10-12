"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // LocalStorage থেকে পুরনো কার্ট লোড করা
  useEffect(() => {
    const savedCart = localStorage.getItem("pawmart_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // কার্ট পরিবর্তন হলে LocalStorage-এ সেভ করা
  useEffect(() => {
    localStorage.setItem("pawmart_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);