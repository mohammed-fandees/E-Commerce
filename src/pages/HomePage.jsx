export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Exclusive E-Commerce</h1>
      <p className="text-lg text-gray-700 mb-8">Your one-stop shop for exclusive products.</p>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
        Shop Now
      </button>
    </div>
  );
}