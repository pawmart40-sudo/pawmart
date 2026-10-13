  import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            🐾 PawMart
          </Link>
          <div className="hidden md:flex gap-8 text-gray-700 font-medium">
            <Link href="/" className="hover:text-orange-500">Home</Link>
            <Link href="/shop" className="hover:text-orange-500">Shop</Link>
            <Link href="/about" className="hover:text-orange-500">About</Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-gray-700 font-semibold hover:text-orange-500">
              Login
            </Link>
            <Link href="/register" className="bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-5xl font-bold text-gray-900 leading-tight">
            Give Your Pet <span className="text-orange-500">The Best Care</span>
          </h2>
          <p className="mt-6 text-lg text-gray-600">
            Premium food, toys, and accessories for your beloved pets. Delivered to your doorstep in Bangladesh.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/shop" className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
              Shop Now
            </Link>
            <Link href="/shop" className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-orange-500 transition">
             Categories
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          <img 
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600" 
            alt="Happy Pet" 
            className="rounded-3xl shadow-2xl w-full max-w-md object-cover"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Featured Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🍖", name: "Food" },
            { icon: "🧸", name: "Toys" },
            { icon: "🏠", name: "Beds" },
            { icon: "💊", name: "Health" }
          ].map((cat) => (
            <div key={cat.name} className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-lg transition cursor-pointer">
              <p className="text-5xl mb-4">{cat.icon}</p>
              <p className="font-semibold text-gray-800">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h4 className="text-2xl font-bold text-orange-500 mb-2">🐾 PawMart</h4>
          <p className="text-gray-400 text-sm">© 2026 PawMart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}