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
      icon: <FiShield className="w-6 h-6" />,
      title: 'Secure Bidding',
      description: 'Our platform ensures safe and secure transactions for all users.'
    },
    {
      icon: <FiAward className="w-6 h-6" />,
      title: 'Verified Items',
      description: 'All items are thoroughly verified for authenticity and quality.'
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: 'Competitive Prices',
      description: 'Get the best deals through our competitive bidding system.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="block text-indigo-200">AuctionHub</span>
            </h1>
            <p className="max-w-md mx-auto mt-3 text-base text-indigo-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Your premier destination for online auctions. Buy  unique items in a secure and competitive environment.
            </p>
            <div className="max-w-md mx-auto mt-5 sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/signup"
                  className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-indigo-600 bg-white border border-transparent rounded-md hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to="/login"
                  className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-indigo-500 border border-transparent rounded-md hover:bg-indigo-600 md:py-4 md:text-lg md:px-10"
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
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold tracking-wide text-indigo-600 uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Why Choose AuctionHub?
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.title} className="relative">
                  <div className="absolute flex items-center justify-center w-12 h-12 text-white bg-indigo-500 rounded-md">
                    {feature.icon}
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Items Section */}
      <div className="py-12 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 lg:text-center">
            <h2 className="text-base font-semibold tracking-wide text-indigo-600 uppercase">Featured Items</h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Recently Sold Items
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredItems.map((item) => (
              <div key={item.id} className="overflow-hidden bg-white rounded-lg shadow">
                <div className="relative h-48">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-0 right-0 px-2 py-1 text-sm text-white bg-indigo-600">
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
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              View All Items
              <FiArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl px-4 py-16 mx-auto text-center sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl animate__animated animate__fadeInDown">
            <span className="block">Ready to start bidding?</span>
            <span className="block">Join AuctionHub today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200 animate__animated animate__fadeInUp animate__delay-1s">
            Create your account and start participating in exciting auctions.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center w-full px-5 py-3 mt-8 text-base font-medium text-indigo-600 bg-white border border-transparent rounded-md hover:bg-indigo-50 sm:w-auto animate__animated animate__pulse animate__delay-2s animate__infinite"
          >
            Sign up for free
          </Link>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50 animate__animated animate__fadeIn">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 lg:text-center">
            <h2 className="text-base font-semibold tracking-wide text-purple-600 uppercase">How It Works</h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Simple Steps to Start Bidding
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center p-8 transition-transform duration-300 bg-white shadow-lg rounded-xl hover:scale-105 animate__animated animate__fadeInUp">
              <div className="p-4 mb-4 text-indigo-600 bg-indigo-100 rounded-full animate-bounce">
                <FiAward className="w-8 h-8" />
              </div>
              <h4 className="mb-2 text-lg font-semibold">1. Create Account</h4>
              <p className="text-gray-500">Sign up in seconds and join our community of auction enthusiasts.</p>
            </div>
            <div className="flex flex-col items-center p-8 transition-transform duration-300 bg-white shadow-lg rounded-xl hover:scale-105 animate__animated animate__fadeInUp animate__delay-1s">
              <div className="p-4 mb-4 text-purple-600 bg-purple-100 rounded-full animate-bounce">
                <FiTrendingUp className="w-8 h-8" />
              </div>
              <h4 className="mb-2 text-lg font-semibold">2. Explore & Bid</h4>
              <p className="text-gray-500">Browse unique items and place secure bids with real-time updates.</p>
            </div>
            <div className="flex flex-col items-center p-8 transition-transform duration-300 bg-white shadow-lg rounded-xl hover:scale-105 animate__animated animate__fadeInUp animate__delay-2s">
              <div className="p-4 mb-4 text-green-600 bg-green-100 rounded-full animate-bounce">
                <FiShield className="w-8 h-8" />
              </div>
              <h4 className="mb-2 text-lg font-semibold">3. Win & Enjoy</h4>
              <p className="text-gray-500">Win your auction, complete payment, and receive your item quickly and safely.</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-16 bg-white animate__animated animate__fadeIn">
        <div className="flex flex-col items-center max-w-5xl gap-12 px-4 mx-auto sm:px-6 lg:px-8 md:flex-row">
          <div className="flex-1 animate__animated animate__fadeInLeft">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" alt="About AuctionHub" className="w-full shadow-xl rounded-2xl" />
          </div>
          <div className="flex-1 animate__animated animate__fadeInRight">
            <h2 className="mb-4 text-3xl font-extrabold text-indigo-700">About AuctionHub</h2>
            <p className="mb-4 text-lg text-gray-600">AuctionHub is dedicated to providing a transparent, secure, and engaging auction experience. Our platform connects buyers and sellers from around the world, offering a diverse range of unique and high-quality items. We believe in fair competition, verified listings, and top-notch customer support.</p>
            <ul className="pl-5 text-gray-500 list-disc">
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
        <div className="grid items-center max-w-6xl grid-cols-1 gap-16 px-4 mx-auto sm:px-6 lg:px-8 md:grid-cols-2">
          {/* Contact Options */}
          <div className="space-y-8">
            <div className="text-center md:text-left">
              <h2 className="mb-3 text-4xl font-extrabold text-indigo-700 animate__animated animate__fadeInLeft">Contact Us</h2>
              <p className="mt-2 text-lg text-gray-600 animate__animated animate__fadeInLeft animate__delay-1s">We'd love to hear from you! Reach out for support, partnership, or just to say hello.</p>
            </div>
            <div className="flex flex-col gap-6 animate__animated animate__fadeInLeft animate__delay-2s">
              <div className="flex items-center p-4 transition bg-white rounded-lg shadow hover:shadow-lg">
                <span className="p-3 mr-4 text-indigo-600 bg-indigo-100 rounded-full"><i className="fas fa-envelope fa-lg"></i></span>
                <div>
                  <div className="font-bold text-gray-700">Email</div>
                  <a href="mailto:support@auctionhub.com" className="text-indigo-600 hover:underline">alainndizeye11@gmail.com</a>
                </div>
              </div>
              <div className="flex items-center p-4 transition bg-white rounded-lg shadow hover:shadow-lg">
                <span className="p-3 mr-4 text-indigo-600 bg-indigo-100 rounded-full"><i className="fas fa-phone fa-lg"></i></span>
                <div>
                  <div className="font-bold text-gray-700">Phone</div>
                  <a href="tel:+1234567890" className="text-indigo-600 hover:underline">+250 799324850</a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 bg-white shadow-lg rounded-xl animate__animated animate__fadeInRight">
            <form action="https://formspree.io/f/xeogdzry" method="POST" className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  name="message"
                  id="message"
                  rows="4"
                  required
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-16 pb-8 mt-0 text-white bg-gradient-to-r from-indigo-700 to-purple-700 animate__animated animate__fadeInUp">
        <div className="grid grid-cols-1 gap-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 md:grid-cols-4">
          {/* Company */}
          <div>
            <h3 className="mb-4 text-2xl font-bold">AuctionHub</h3>
            <p className="mb-4 text-indigo-100">Your premier destination for unique online auctions. Secure, trusted, and global.</p>
            <div className="flex gap-4 mt-4">
              <a href="https://x.com/ndizeyealain1" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-indigo-300"><i className="fab fa-twitter"></i></a>
              <a href="https://facebook.com/auctionhub" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-indigo-300"><i className="fab fa-facebook"></i></a>
              <a href="alainndizeye11@gmail.com" className="text-2xl hover:text-indigo-300"><i className="fas fa-envelope"></i></a>
              <a href="tel:+250799324850" className="text-2xl hover:text-indigo-300"><i className="fas fa-phone"></i></a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/items" className="hover:underline">Browse Items</Link></li>
              <li><Link to="/login" className="hover:underline">Login</Link></li>
              <li><Link to="/signup" className="hover:underline">Sign Up</Link></li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h4 className="mb-3 text-lg font-semibold">Contact</h4>
            <ul className="space-y-2">
              <li><span className="font-medium">Email:</span> <a href="alainndizeye11@gmail.com" className="hover:underline">support@auctionhub.com</a></li>
              <li><span className="font-medium">Phone:</span> <a href="tel:+250799324850" className="hover:underline">+25099324850</a></li>
              <li><span className="font-medium">Address:</span> Kigali,Rwanda</li>
            </ul>
          </div>
          {/* Newsletter */}
          
        </div>
        <div className="mt-12 text-sm text-center text-indigo-200">
          &copy; {new Date().getFullYear()} AuctionHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;