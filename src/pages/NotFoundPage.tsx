import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="text-center z-10">
        <h1 className="text-6xl font-bold mb-4 text-indigo-500">404</h1>
        <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          We couldn't find the page you were looking for. It might have been moved or deleted.
        </p>
        <Link
          to="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          Return Home
        </Link>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[800px] h-[800px] border-[40px] border-indigo-600 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}