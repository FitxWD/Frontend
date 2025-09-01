import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export default function LoginPage() {
  return (
    <div className="bg-gray-900 text-gray-200 flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 md:p-12">

            {/* === HEADER === */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Welcome Back
              </h1>
              <p className="text-gray-400 mt-2">
                Sign in to continue your fitness journey.
              </p>
            </div>

            {/* === LOGIN FORM === */}
            <form className="space-y-6">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm text-green-400 hover:text-green-500 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>Sign In</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* === DIVIDER & SIGN UP LINK === */}
            <div className="text-center mt-8">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <a
                  href="/signup" // Adjust this link to your signup page
                  className="font-medium text-green-400 hover:text-green-500 transition-colors"
                >
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}