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
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start bidding?</span>
            <span className="block">Join AuctionHub today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Create your account and start participating in exciting auctions.
          </p>
          <Link
            to="/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 