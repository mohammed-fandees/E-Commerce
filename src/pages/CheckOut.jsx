export default function CheckOut() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Cash Out</h1>
      <p className="text-lg text-gray-700 mb-8">Your order has been successfully placed!</p>
      <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
        Continue Shopping
      </button>
    </div>
  );
}