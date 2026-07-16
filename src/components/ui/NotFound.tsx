
import { Home, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center max-w-md">

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                        <Search className="w-10 h-10 text-red-500" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-6xl font-bold text-gray-900">404</h1>

                {/* Subtitle */}
                <h2 className="mt-4 text-xl font-semibold text-gray-700">
                    Page Not Found
                </h2>

                <p className="mt-2 text-gray-500">
                    The page you are looking for doesn’t exist or has been moved.
                </p>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 transition"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}