import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">Page not found</h2>
          <p className="mt-4 text-lg text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Login
          </Link>
          <div className="mt-3">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Or go to Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 