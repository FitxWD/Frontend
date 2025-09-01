import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserPlusIcon } from '@heroicons/react/24/solid';

export default function SignupPage() {
  return (
    <div className="bg-gray-900 text-gray-200 flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 md:p-12">

            {/* === HEADER === */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Start Your Journey
              </h1>
              <p className="text-gray-400 mt-2">
                Create an account to get your personalized plan.
              </p>
            </div>

            {/* === SIGNUP FORM === */}
            <form className="space-y-6">
              {/* Full Name Input */}
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  autoComplete="name"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  placeholder="e.g., Alex Doe"
                />
              </div>

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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  placeholder="Minimum 8 characters"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>Create My Free Account</span>
                  <UserPlusIcon className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* === DIVIDER & SIGN IN LINK === */}
            <div className="text-center mt-8">
              <p className="text-gray-400">
                Already have an account?{" "}
                <a
                  href="/login" // Link to your login page
                  className="font-medium text-green-400 hover:text-green-500 transition-colors"
                >
                  Sign In
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