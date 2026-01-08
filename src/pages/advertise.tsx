import StaticPageLayout from '@/components/StaticPageLayout';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Mail, Phone, TrendingUp, Users, Target, BarChart3, Newspaper } from 'lucide-react';
import Link from 'next/link';

const AdvertisePage = () => {
  return (
    <>
      <Header />
      <StaticPageLayout 
        title="Advertise With Us"
        description="Reach Ghana's most engaged audience with GH News. Discover our advertising solutions, audience insights, and partnership opportunities."
        canonical="https://ghnewsmedia.com/advertise"
      >
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>Reach Ghana&apos;s Most Engaged Audience</h2>
          <p style={{ fontSize: '18px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            GH News offers a unique opportunity to connect with a diverse, engaged, and influential audience across Ghana and beyond. Our readers are educated, affluent, and passionate about staying informed on the latest in politics, business, technology, sports, entertainment, and culture.
          </p>
        </section>
        
        <div style={{ backgroundColor: '#EFF6FF', borderLeft: '4px solid #2563EB', padding: '24px', borderRadius: '8px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1E40AF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={24} />
            Why Advertise with GH News?
          </h3>
          <ul style={{ fontSize: '16px', lineHeight: '1.8', color: '#374151', marginLeft: '24px' }}>
            <li style={{ marginBottom: '12px' }}><strong>Unparalleled Reach:</strong> Access millions of monthly unique visitors across Ghana and the diaspora</li>
            <li style={{ marginBottom: '12px' }}><strong>Targeted Demographics:</strong> Connect with specific audience segments based on interests, location, and behavior</li>
            <li style={{ marginBottom: '12px' }}><strong>High Engagement:</strong> Our readers spend significant time on our platform, with above-average session duration</li>
            <li style={{ marginBottom: '12px' }}><strong>Trusted Environment:</strong> Align your brand with a credible, respected news source</li>
            <li style={{ marginBottom: '12px' }}><strong>Mobile-First Audience:</strong> Reach users on the devices they use most</li>
            <li style={{ marginBottom: '12px' }}><strong>Diverse Content Categories:</strong> Target audiences across news, business, sports, entertainment, tech, and lifestyle</li>
          </ul>
        </div>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>Our Audience</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#F9FAFB', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <Users size={32} style={{ color: '#2563EB', margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#111111', marginBottom: '8px' }}>Diverse Demographics</h4>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>18-65+ age range, balanced gender distribution, urban and suburban focus</p>
            </div>
            <div style={{ backgroundColor: '#F9FAFB', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <Target size={32} style={{ color: '#2563EB', margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#111111', marginBottom: '8px' }}>High Engagement</h4>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>Above-average time on site, multiple page views per session, active social sharing</p>
            </div>
            <div style={{ backgroundColor: '#F9FAFB', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <BarChart3 size={32} style={{ color: '#2563EB', margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#111111', marginBottom: '8px' }}>Growing Reach</h4>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>Consistent month-over-month growth in readership and engagement</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>Our Advertising Solutions</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '24px' }}>
            We offer a comprehensive range of advertising solutions designed to meet your marketing objectives and budget:
          </p>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Newspaper size={20} />
              Display Advertising
            </h3>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '12px' }}>
              High-impact banner ads, leaderboards, and sidebar placements that capture attention without disrupting the reading experience. Available in multiple sizes and formats optimized for desktop and mobile.
            </p>
            <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px' }}>
              <li>Banner ads (728x90, 300x250, 320x50)</li>
              <li>Leaderboard placements</li>
              <li>Sidebar and in-content placements</li>
              <li>Mobile-optimized formats</li>
            </ul>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px' }}>Sponsored Content</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '12px' }}>
              Native advertising that seamlessly integrates with our editorial content. Tell your brand story through articles, videos, and multimedia content that resonates with our audience.
            </p>
            <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px' }}>
              <li>Sponsored articles and features</li>
              <li>Branded content campaigns</li>
              <li>Video sponsorships</li>
              <li>Infographic and interactive content</li>
            </ul>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px' }}>Newsletter Sponsorship</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '12px' }}>
              Reach our most engaged subscribers through our daily and weekly newsletters. High open rates and click-through rates make this an effective channel for brand awareness and lead generation.
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px' }}>Category Sponsorships</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '12px' }}>
              Become the exclusive sponsor of a content category (News, Business, Sports, Entertainment, Tech, Lifestyle) and gain premium visibility across all content in that section.
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px' }}>Event Partnerships</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '12px' }}>
              Co-host or sponsor events, webinars, and conferences. Leverage our platform to promote your events and reach our engaged audience.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>Advertising Guidelines</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            To maintain the integrity of our platform and ensure a positive experience for our readers, all advertisements must:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li>Comply with all applicable laws and regulations in Ghana</li>
            <li>Be clearly identified as advertising content</li>
            <li>Not contain false, misleading, or deceptive claims</li>
            <li>Respect our editorial independence and values</li>
            <li>Meet our technical specifications and quality standards</li>
            <li>Not promote illegal products or services</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>Get Started</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '24px' }}>
            Our advertising team is ready to create a customized package that meets your brand&apos;s needs and marketing objectives. Contact us today to receive our media kit, discuss your campaign goals, and explore partnership opportunities.
          </p>

          <div style={{ backgroundColor: '#F3F4F6', padding: '24px', borderRadius: '8px', marginTop: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '20px' }}>Contact Our Advertising Team</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Mail size={20} style={{ color: '#2563EB', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111111', marginBottom: '4px' }}>Email Us</h4>
                  <a 
                    href="mailto:ghnewsmedia7@gmail.com?subject=Advertising Inquiry" 
                    style={{ color: '#2563EB', textDecoration: 'none', fontSize: '16px' }}
                  >
                    ghnewsmedia7@gmail.com
                  </a>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Phone size={20} style={{ color: '#2563EB', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111111', marginBottom: '4px' }}>Call Us</h4>
                  <a 
                    href="tel:+233500651988" 
                    style={{ color: '#2563EB', textDecoration: 'none', fontSize: '16px' }}
                  >
                    +233 (0) 50 065 1988
                  </a>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM GMT
              </p>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>
                We typically respond to inquiries within 24-48 hours.
              </p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>Request Our Media Kit</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            Download our comprehensive media kit which includes:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li>Audience demographics and insights</li>
            <li>Advertising rates and packages</li>
            <li>Technical specifications</li>
            <li>Case studies and success stories</li>
            <li>Contact information for our sales team</li>
          </ul>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            <Link href="/contact" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '500' }}>
              Contact us
            </Link> to request our media kit or schedule a consultation with our advertising team.
          </p>
        </section>
      </StaticPageLayout>
      <Footer />
    </>
  );
};

export default AdvertisePage;
