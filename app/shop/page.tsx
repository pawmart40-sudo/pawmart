"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* হেডার */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🛍️ Our Products</h1>
          <Link href="/cart" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
            🛒 Cart ({cart.length})
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">এখনো কোনো প্রোডাক্ট অ্যাড করা হয়নি।</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition flex flex-col">
                <img src={p.image} alt={p.name} className="w-full h-48 object-cover rounded-lg mb-3" />
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{p.category}</p>
                <p className="text-orange-500 font-bold text-xl mb-3">৳ {p.price}</p>
                <button 
                  onClick={() => addToCart(p)}
                  className="mt-auto w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}