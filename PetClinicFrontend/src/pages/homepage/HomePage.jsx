import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="bg-white shadow-sm py-4 px-4 sm:px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-700">🐾 PetClinic</h1>
        <nav className="flex items-center gap-3 text-sm">
          <Link
            to="/login"
            className="text-purple-700 font-medium hover:underline"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
          >
            Register
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-16 text-center">
        <div className="max-w-2xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Welcome to PetClinic 🐶🐱
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Manage your pet’s health records, appointments, and find the best vets — all in one place.
          </p>
          <Link
            to="/register"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full text-base sm:text-lg hover:bg-purple-700 transition"
          >
            Get Started
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 text-center py-4 px-4">
        <p className="text-xs sm:text-sm text-gray-500">
          © {new Date().getFullYear()} PetClinic. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
