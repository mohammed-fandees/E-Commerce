export default function ProductDetailsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Product Details</h1>
      <p className="text-lg text-gray-700 mb-8">Here you can view the details of the selected product.</p>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
        Add to Cart
      </button>
    </div>
  );
}