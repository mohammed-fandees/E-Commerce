export default function WishList() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Your Wish List</h1>
      <p className="text-lg text-gray-700 mb-8">Here you can find all the products you wish to purchase.</p>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <ul className="list-disc pl-5">
          <li className="mb-2">Product 1</li>
          <li className="mb-2">Product 2</li>
          <li className="mb-2">Product 3</li>
        </ul>
        <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
          Continue Shopping
        </button>
      </div>
    </div>
  );
}