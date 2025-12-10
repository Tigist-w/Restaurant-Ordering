export default function Success() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        Payment Successful!
      </h1>
      <p className="mb-6">
        Thank you for your order. Your food will be prepared shortly.
      </p>
      <a
        href="/orders"
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
      >
        View Orders
      </a>
    </div>
  );
}
