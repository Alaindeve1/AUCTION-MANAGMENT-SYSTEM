import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="text-white bg-gray-900">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">AuctionHub</h3>
            <p className="text-gray-400">
              Your trusted platform for online auctions. Buy and sell items with confidence through our secure and transparent bidding system.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-400 transition-colors hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/items" className="text-gray-400 transition-colors hover:text-white">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/wins" className="text-gray-400 transition-colors hover:text-white">
                  wins
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="text-gray-400 transition-colors hover:text-white">
                  notifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
                <li>Email:
                  <a href="auction@gmail.com" className="hover:underline">auction@gmail.com</a>
                </li>
                <li>Phone: +250 799324850</li>
              <li>Address: Kigali,Rwanda</li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <FaFacebook className="w-6 h-6" />
              </a>
              <a
                href="https://x.com/ndizeyealain1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <FaTwitter className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
              <a
                href="https://rw.linkedin.com/in/ndizeye-alain?original_referer=https%3A%2F%2Fwww.google.com%2F"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <FaLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 text-center text-gray-400 border-t border-gray-800">
          <p>&copy; {new Date().getFullYear()} AuctionHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 