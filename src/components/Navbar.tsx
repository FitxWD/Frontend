import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className="bg-gray-900/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800 shadow-sm">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
          <Image
            src="/logo.jpeg"
            alt="Wellness AI Coach Logo"
            width={45}     
            height={45}   
            className="rounded-full border-2 border-green-500"
          />
          <span className="font-bold text-xl text-white tracking-wide hidden sm:block">
            Wellness Assistant
          </span>
        </Link>

        {/* Buttons Section */}
        <div className="flex items-center space-x-3 md:space-x-5">
          <Link href="/login">
            <button className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-md px-5 py-2.5 transition-all shadow-sm hover:shadow-lg">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-md px-5 py-2.5 transition-all shadow-sm hover:shadow-lg">
              Register
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
