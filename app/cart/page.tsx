"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, total, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-600 mb-4">🛒 আপনার কার্ট খালি</h1>
        <Link href="/shop" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🛒 Your Cart</h1>

        <div className="space-y-4">
          {cart.map((item: any) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-orange-500 font-semibold">৳ {item.price} × {item.quantity}</p>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 font-semibold hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center text-xl font-bold mb-4">
            <span>Total:</span>
            <span className="text-orange-500">৳ {total}</span>
          </div>
          <Link 
            href="/checkout"
            className="block w-full bg-orange-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Proceed to Checkout
          </Link>
          <button 
            onClick={clearCart}
            className="block w-full text-center mt-3 text-gray-500 hover:text-red-500 font-semibold"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}