import { Link } from 'react-router-dom';
import { FiArrowRight, FiAward, FiShield, FiTrendingUp } from 'react-icons/fi';

const LandingPage = () => {
  const featuredItems = [
    {
      id: 1,
      title: 'Vintage Watch',
      price: '$2,500',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Collectibles'
    },
    {
      id: 2,
      title: 'Antique Vase',
      price: '$1,800',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Antiques'
    },
    {
      id: 3,
      title: 'Rare Coin Collection',
      price: '$3,200',
      image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Collectibles'
    }
  ];

  const features = [
    {
      icon: <FiShield className="h-6 w-6" />,
      title: 'Secure Bidding',
      description: 'Our platform ensures safe and secure transactions for all users.'
    },
    {
      icon: <FiAward className="h-6 w-6" />,
      title: 'Verified Items',
      description: 'All items are thoroughly verified for authenticity and quality.'
    },
    {
      icon: <FiTrendingUp className="h-6 w-6" />,
      title: 'Competitive Prices',
      description: 'Get the best deals through our competitive bidding system.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="block text-indigo-200">AuctionHub</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Your premier destination for online auctions. Buy and sell unique items in a secure and competitive environment.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 md:py-4 md:text-lg md:px-10"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose AuctionHub?
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.title} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    {feature.icon}
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Items Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Featured Items</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Recently Sold Items
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredItems.map((item) => (
              <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="relative h-48">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white px-2 py-1 text-sm">
                    {item.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-xl font-semibold text-indigo-600">{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/items"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View All Items
              <FiArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl animate__animated animate__fadeInDown">
            <span className="block">Ready to start bidding?</span>
            <span className="block">Join AuctionHub today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200 animate__animated animate__fadeInUp animate__delay-1s">
            Create your account and start participating in exciting auctions.
          </p>
          <Link
            to="/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto animate__animated animate__pulse animate__delay-2s animate__infinite"
          >
            Sign up for free
          </Link>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50 animate__animated animate__fadeIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple Steps to Start Bidding
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transition-transform duration-300 hover:scale-105 animate__animated animate__fadeInUp">
              <div className="bg-indigo-100 text-indigo-600 rounded-full p-4 mb-4 animate-bounce">
                <FiAward className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold mb-2">1. Create Account</h4>
              <p className="text-gray-500">Sign up in seconds and join our community of auction enthusiasts.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transition-transform duration-300 hover:scale-105 animate__animated animate__fadeInUp animate__delay-1s">
              <div className="bg-purple-100 text-purple-600 rounded-full p-4 mb-4 animate-bounce">
                <FiTrendingUp className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold mb-2">2. Explore & Bid</h4>
              <p className="text-gray-500">Browse unique items and place secure bids with real-time updates.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transition-transform duration-300 hover:scale-105 animate__animated animate__fadeInUp animate__delay-2s">
              <div className="bg-green-100 text-green-600 rounded-full p-4 mb-4 animate-bounce">
                <FiShield className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold mb-2">3. Win & Enjoy</h4>
              <p className="text-gray-500">Win your auction, complete payment, and receive your item quickly and safely.</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-16 bg-white animate__animated animate__fadeIn">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 animate__animated animate__fadeInLeft">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" alt="About AuctionHub" className="rounded-2xl shadow-xl w-full" />
          </div>
          <div className="flex-1 animate__animated animate__fadeInRight">
            <h2 className="text-3xl font-extrabold text-indigo-700 mb-4">About AuctionHub</h2>
            <p className="text-lg text-gray-600 mb-4">AuctionHub is dedicated to providing a transparent, secure, and engaging auction experience. Our platform connects buyers and sellers from around the world, offering a diverse range of unique and high-quality items. We believe in fair competition, verified listings, and top-notch customer support.</p>
            <ul className="list-disc pl-5 text-gray-500">
              <li>Trusted by thousands of users</li>
              <li>24/7 support and guidance</li>
              <li>Cutting-edge security & privacy</li>
              <li>Modern, mobile-friendly design</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-gradient-to-br from-purple-100 to-indigo-50 animate__animated animate__fadeInUp">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Contact Options */}
          <div className="space-y-8">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-extrabold text-indigo-700 mb-3 animate__animated animate__fadeInLeft">Contact Us</h2>
              <p className="mt-2 text-lg text-gray-600 animate__animated animate__fadeInLeft animate__delay-1s">We'd love to hear from you! Reach out for support, partnership, or just to say hello.</p>
            </div>
            <div className="flex flex-col gap-6 animate__animated animate__fadeInLeft animate__delay-2s">
              <div className="flex items-center shadow rounded-lg bg-white p-4 hover:shadow-lg transition">
                <span className="bg-indigo-100 text-indigo-600 rounded-full p-3 mr-4"><i className="fas fa-envelope fa-lg"></i></span>
                <div>
                  <div className="font-bold text-gray-700">Email</div>
                  <a href="mailto:support@auctionhub.com" className="text-indigo-600 hover:underline">support@auctionhub.com</a>
                </div>
              </div>
              <div className="flex items-center shadow rounded-lg bg-white p-4 hover:shadow-lg transition">
                <span className="bg-indigo-100 text-indigo-600 rounded-full p-3 mr-4"><i className="fas fa-phone fa-lg"></i></span>
                <div>
                  <div className="font-bold text-gray-700">Phone</div>
                  <a href="tel:+1234567890" className="text-indigo-600 hover:underline">+1 234 567 890</a>
                </div>
              </div>
              <div className="flex items-center shadow rounded-lg bg-white p-4 hover:shadow-lg transition">
                <span className="bg-indigo-100 text-indigo-600 rounded-full p-3 mr-4"><i className="fab fa-twitter fa-lg"></i></span>
                <div>
                  <div className="font-bold text-gray-700">Twitter</div>
                  <a href="https://twitter.com/auctionhub" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">@auctionhub</a>
                </div>
              </div>
              <div className="flex items-center shadow rounded-lg bg-white p-4 hover:shadow-lg transition">
                <span className="bg-indigo-100 text-indigo-600 rounded-full p-3 mr-4"><i className="fab fa-facebook fa-lg"></i></span>
                <div>
                  <div className="font-bold text-gray-700">Facebook</div>
                  <a href="https://facebook.com/auctionhub" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">AuctionHub</a>
                </div>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-10 animate__animated animate__fadeInRight">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Name</label>
                <input type="text" name="name" id="name" autoComplete="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
                <input type="email" name="email" id="email" autoComplete="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700">Message</label>
                <textarea name="message" id="message" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
              </div>
              <div className="text-center">
                <button type="submit" className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 animate__animated animate__pulse animate__infinite">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white pt-16 pb-8 mt-0 animate__animated animate__fadeInUp">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company */}
          <div>
            <h3 className="text-2xl font-bold mb-4">AuctionHub</h3>
            <p className="text-indigo-100 mb-4">Your premier destination for unique online auctions. Secure, trusted, and global.</p>
            <div className="flex gap-4 mt-4">
              <a href="https://twitter.com/auctionhub" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 text-2xl"><i className="fab fa-twitter"></i></a>
              <a href="https://facebook.com/auctionhub" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 text-2xl"><i className="fab fa-facebook"></i></a>
              <a href="mailto:support@auctionhub.com" className="hover:text-indigo-300 text-2xl"><i className="fas fa-envelope"></i></a>
              <a href="tel:+1234567890" className="hover:text-indigo-300 text-2xl"><i className="fas fa-phone"></i></a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/items" className="hover:underline">Browse Items</Link></li>
              <li><Link to="/login" className="hover:underline">Login</Link></li>
              <li><Link to="/signup" className="hover:underline">Sign Up</Link></li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact</h4>
            <ul className="space-y-2">
              <li><span className="font-medium">Email:</span> <a href="mailto:support@auctionhub.com" className="hover:underline">support@auctionhub.com</a></li>
              <li><span className="font-medium">Phone:</span> <a href="tel:+1234567890" className="hover:underline">+1 234 567 890</a></li>
              <li><span className="font-medium">Address:</span> 123 Auction St, New York, NY</li>
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Newsletter</h4>
            <form className="flex flex-col gap-2">
              <input type="email" placeholder="Your email address" className="rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-400" />
              <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 rounded-md px-3 py-2 mt-1 font-semibold">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="mt-12 text-center text-indigo-200 text-sm">
          &copy; {new Date().getFullYear()} AuctionHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;