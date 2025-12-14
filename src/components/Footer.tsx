import { Facebook, Mail, MapPin, MessageCircle, Phone, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import { categories } from '../data/mockData';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#1A365D', fontFamily: "'Inter', 'Source Sans 3', system-ui, sans-serif" }}>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div>
            <h3 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
              GhNewsMedia
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
              Ghana&apos;s premier digital news platform, delivering accurate, timely, and comprehensive news coverage across politics, business, sports, and more.
            </p>
            
            {/* Social Media Links */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href="https://www.facebook.com/profile.php?id=61577876216304&mibextid=ZbWKwL"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#1877F2',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  textDecoration: 'none'
                }}
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://x.com/ghnewsmedia?t=Fx80oa-73oEdgyznOxM_Yg&s=09"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X (Twitter)"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  textDecoration: 'none'
                }}
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://youtube.com/@ghnewsmedia?si=X7l2KfRAkWHG2bAu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to our YouTube channel"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#FF0000',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  textDecoration: 'none'
                }}
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb66ViJK5cDJ8RjFSR2D"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join our WhatsApp channel"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  textDecoration: 'none'
                }}
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Categories
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {categories.map((category) => (
                <li key={category.id} style={{ marginBottom: '12px' }}>
                  <Link
                    href={`/${category.slug}`}
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      fontSize: '13px',
                      textDecoration: 'none',
                      display: 'block'
                    }}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <Link href="/privacy" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', textDecoration: 'none', display: 'block' }}>
                  Privacy Policy
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link href="/terms" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', textDecoration: 'none', display: 'block' }}>
                  Terms of Service
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link href="/advertise" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', textDecoration: 'none', display: 'block' }}>
                  Advertise With Us
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link href="/about" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', textDecoration: 'none', display: 'block' }}>
                  About Us
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link href="/contact" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', textDecoration: 'none', display: 'block' }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={16} style={{ color: 'rgba(255, 255, 255, 0.8)', marginTop: '2px', flexShrink: 0 }} />
                <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', lineHeight: '1.5' }}>
                  Accra, Ghana
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Phone size={16} style={{ color: 'rgba(255, 255, 255, 0.8)', marginTop: '2px', flexShrink: 0 }} />
                <a 
                  href="tel:+233500651988"
                  style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', textDecoration: 'none', lineHeight: '1.5' }}
                >
                  +233 (0) 50 065 1988
                </a>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Mail size={16} style={{ color: 'rgba(255, 255, 255, 0.8)', marginTop: '2px', flexShrink: 0 }} />
                <a 
                  href="mailto:ghnewsmedia7@gmail.com"
                  style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', textDecoration: 'none', lineHeight: '1.5' }}
                >
                  ghnewsmedia7@gmail.com
                </a>
              </div>

              {/* WhatsApp Channel Link */}
              <div style={{ marginTop: '8px' }}>
                <a
                  href="https://whatsapp.com/channel/0029Vb66ViJK5cDJ8RjFSR2D"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '500',
                    borderRadius: '4px',
                    textDecoration: 'none'
                  }}
                >
                  <MessageCircle size={16} />
                  Join WhatsApp Channel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
        <div className="container mx-auto px-4 py-4 sm:py-5">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            alignItems: 'center',
            textAlign: 'center'
          }}
          className="sm:flex-row sm:justify-between sm:items-center sm:text-left"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className="sm:flex-row sm:items-center sm:gap-4">
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', margin: 0 }}>
                © {new Date().getFullYear()} GhNewsMedia. All rights reserved.
              </p>
              <span style={{ display: 'none', color: 'rgba(255, 255, 255, 0.3)' }} className="sm:inline">|</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>Ghana&apos;s Premier News Platform</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className="sm:flex-row sm:items-center sm:gap-4">
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', margin: 0 }}>
                Developed by{' '}
                <a
                  href="https://charlesawuku.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none', fontWeight: '500' }}
                >
                  Charles Awuku
                </a>
              </p>
              <span style={{ display: 'none', color: 'rgba(255, 255, 255, 0.3)' }} className="sm:inline">|</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>ghnewsmedia.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;