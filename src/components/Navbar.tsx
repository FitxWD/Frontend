import Image from 'next/image'; // <-- Import the Image component
import Link from 'next/link';   // <-- Import the Link component for navigation

const Navbar = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.jpeg" // <-- Path to your logo in the public folder
            alt="Wellness AI Coach Logo"
            width={40}      // <-- Specify the width
            height={40}     // <-- Specify the height
            className="rounded-full" // Optional: if you want a circular frame
          />
          <span className="font-bold text-xl text-white hidden sm:block">
            Wellness AI Coach
          </span>
        </Link>

        {/* Buttons Section */}
        <div className="space-x-2 md:space-x-4">
          <Link href="/login">
            <button className="text-white hover:bg-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors">
              Register
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;