export default function NoInternet() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold">Oops!</h1>
      <p className="text-lg mt-2 text-gray-700">
        Please check your internet connection.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="mt-6 px-5 py-2 bg-black text-white rounded-xl"
      >
        Retry
      </button>
    </div>
  );
}
