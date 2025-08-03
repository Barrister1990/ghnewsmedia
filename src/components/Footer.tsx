import { Facebook, Mail, MapPin, MessageCircle, Phone, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import { categories } from '../data/mockData';

const Footer = () => {
  return (
    <footer className="bg-news-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gradient">GhNewsMedia</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Ghana&apos;s premier digital news platform, delivering accurate, timely, and comprehensive news coverage across politics, business, sports, and more.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61577876216304&mibextid=ZbWKwL"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5 hover:text-accent cursor-pointer transition-colors" />
              </a>
              <a
                href="https://x.com/ghnewsmedia?t=Fx80oa-73oEdgyznOxM_Yg&s=09"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X (Twitter)"
              >
                <Twitter className="w-5 h-5 hover:text-accent cursor-pointer transition-colors" />
              </a>
              <a
                href="https://youtube.com/@ghnewsmedia?si=X7l2KfRAkWHG2bAu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube className="w-5 h-5 hover:text-accent cursor-pointer transition-colors" />
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb66ViJK5cDJ8RjFSR2D"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join our WhatsApp channel"
              >
                <MessageCircle className="w-5 h-5 hover:text-accent cursor-pointer transition-colors" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Categories</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <a
                    href={`/category/${category.slug}`}
                    className="text-gray-300 hover:text-accent transition-colors text-sm flex items-center"
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-gray-300 hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="/advertise" className="text-gray-300 hover:text-accent transition-colors">Advertise With Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-accent" />
                <span className="text-gray-300">
                  <br />
                  Accra, Ghana
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-accent" />
                <span className="text-gray-300">+233 (0) 50 065 1988</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-accent" />
                <span className="text-gray-300">ghnewsmedia7@gmail.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="font-medium mb-2">Subscribe to Newsletter</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 text-white text-sm rounded-l-lg border border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                <button className="bg-accent hover:bg-accent-600 px-4 py-2 text-sm font-medium rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} GhNewsMedia. All rights reserved.
          </p>

          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Developed by{' '}
            <a
              href="https://charlesawuku.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:underline"
            >
              Charles Awuku
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;