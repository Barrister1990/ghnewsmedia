import { Facebook, Mail, MapPin, MessageCircle, Phone, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import { categories } from '../data/mockData';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info - Enhanced Design */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-clip-text text-transparent">
                GhNewsMedia
              </h3>
              <span className="inline-block bg-gradient-to-r from-red-600 to-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                TRUSTED NEWS
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Ghana&apos;s premier digital news platform, delivering accurate, timely, and comprehensive news coverage across politics, business, sports, and more.
            </p>
            
            {/* Social Media Links - Modern Design */}
            <div className="flex items-center space-x-3">
              <a
                href="https://www.facebook.com/profile.php?id=61577876216304&mibextid=ZbWKwL"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/ghnewsmedia?t=Fx80oa-73oEdgyznOxM_Yg&s=09"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X (Twitter)"
                className="w-10 h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@ghnewsmedia?si=X7l2KfRAkWHG2bAu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to our YouTube channel"
                className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb66ViJK5cDJ8RjFSR2D"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join our WhatsApp channel"
                className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories - BBC-Style List */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white border-b-2 border-red-500 pb-2 inline-block">
              News Categories
            </h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group"
                  >
                    <span className="mr-3 text-lg">{category.icon}</span>
                    <span className="text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                      {category.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links - CNN-Style Organization */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white border-b-2 border-blue-500 pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-200"></span>
                  <span className="text-sm font-medium">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-200"></span>
                  <span className="text-sm font-medium">Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-200"></span>
                  <span className="text-sm font-medium">Advertise With Us</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-200"></span>
                  <span className="text-sm font-medium">About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-200"></span>
                  <span className="text-sm font-medium">Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info & Newsletter - Modern Design */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white border-b-2 border-green-500 pb-2 inline-block">
              Contact & Updates
            </h4>
            
            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center group">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-300">
                  Accra, Ghana
                </span>
              </div>
              
              <div className="flex items-center group">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-300">+233 (0) 50 065 1988</span>
              </div>
              
              <div className="flex items-center group">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-300">ghnewsmedia7@gmail.com</span>
              </div>
            </div>

            {/* Newsletter Signup - Enhanced */}
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <h5 className="font-semibold text-white mb-3 text-sm">Stay Updated</h5>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 bg-white/20 text-white placeholder-gray-300 text-sm rounded-lg border border-white/30 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none transition-all duration-200"
                />
                <button className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg">
                  Subscribe Now
                </button>
              </div>
            </div>

            {/* WhatsApp Channel - Prominent */}
            <div className="text-center">
              <a
                href="https://whatsapp.com/channel/0029Vb66ViJK5cDJ8RjFSR2D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                📱 Join WhatsApp Channel
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Enhanced */}
      <div className="border-t border-gray-700 bg-gray-950">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} GhNewsMedia. All rights reserved.
              </p>
              <span className="hidden sm:inline text-gray-600">|</span>
              <span className="text-gray-400 text-sm">Ghana's Premier News Platform</span>
            </div>

            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-sm">
                Developed by{' '}
                <a
                  href="https://charlesawuku.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition-colors duration-200 font-medium"
                >
                  Charles Awuku
                </a>
              </p>
              <span className="hidden sm:inline text-gray-600">|</span>
              <span className="text-gray-400 text-sm">ghnewsmedia.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;