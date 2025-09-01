import Image from 'next/image'; // <-- Import the Image component

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      
        {/* Footer Links Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pt-8 border-t border-gray-800">
          {/* Logo Section */}
          <div className="flex flex-col items-start">
             <div className="flex items-center space-x-3">
                <Image
                  src="/logo.jpeg" // <-- Path to your logo
                  alt="Wellness AI Coach Logo"
                  width={50}
                  height={50}
                />
                 <div>
                    <p className="font-bold text-lg text-white">Wellness AI Coach</p>
                    <p className="text-sm text-gray-400">© {new Date().getFullYear()} All Rights Reserved.</p>
                 </div>
             </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 text-sm">
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blogs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
    </footer>
  );
};

export default Footer;