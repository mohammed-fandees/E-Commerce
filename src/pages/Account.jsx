export default function Account() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Your Account</h1>
      <p className="text-lg text-gray-700 mb-8">Manage your account settings and preferences.</p>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
        Update Account
      </button>
    </div>
  );
}