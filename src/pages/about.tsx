import StaticPageLayout from '@/components/StaticPageLayout';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Target, Users, Award, Newspaper } from 'lucide-react';

const AboutPage = () => {
  return (
    <>
      <Header />
      <StaticPageLayout 
        title="About Us"
        description="Learn about GH News - Ghana's premier digital news platform. Our mission, values, team, and commitment to delivering accurate, timely news."
        canonical="https://ghnewsmedia.com/about"
      >
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>Who We Are</h2>
          <p style={{ fontSize: '18px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            GH News is Ghana&apos;s premier digital news platform, delivering accurate, timely, and comprehensive news coverage across politics, business, sports, entertainment, technology, and lifestyle. We are committed to keeping Ghanaians informed with credible, well-researched journalism that matters.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            Founded with a vision to transform how news is consumed in Ghana, GH News combines traditional journalistic values with modern digital innovation to serve millions of readers across the country and the diaspora.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>Our Mission</h2>
          <div style={{ backgroundColor: '#EFF6FF', borderLeft: '4px solid #2563EB', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
            <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#1E40AF', fontStyle: 'italic', margin: 0 }}>
              To deliver accurate, timely, and impactful news that empowers Ghanaians to make informed decisions, while maintaining the highest standards of journalistic integrity and independence.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>Our Values</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '8px' }}>
              <Award size={32} style={{ color: '#2563EB', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111111', marginBottom: '8px' }}>Integrity</h3>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6' }}>
                We are committed to truth, accuracy, and fairness in all our reporting. Our editorial independence is non-negotiable.
              </p>
            </div>
            <div style={{ backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '8px' }}>
              <Target size={32} style={{ color: '#2563EB', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111111', marginBottom: '8px' }}>Excellence</h3>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6' }}>
                We strive for excellence in every story we tell, ensuring our content is well-researched, well-written, and impactful.
              </p>
            </div>
            <div style={{ backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '8px' }}>
              <Users size={32} style={{ color: '#2563EB', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111111', marginBottom: '8px' }}>Accountability</h3>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6' }}>
                We hold ourselves accountable to our readers and the public, correcting errors promptly and transparently.
              </p>
            </div>
            <div style={{ backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '8px' }}>
              <Newspaper size={32} style={{ color: '#2563EB', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111111', marginBottom: '8px' }}>Innovation</h3>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6' }}>
                We embrace technology and innovation to deliver news in formats that resonate with modern audiences.
              </p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>What We Cover</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            GH News provides comprehensive coverage across multiple categories:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li><strong>News:</strong> Breaking news, politics, government, and current events</li>
            <li><strong>Business:</strong> Economy, finance, entrepreneurship, and market updates</li>
            <li><strong>Sports:</strong> Local and international sports coverage, analysis, and commentary</li>
            <li><strong>Entertainment:</strong> Music, movies, celebrity news, and cultural events</li>
            <li><strong>Technology:</strong> Tech news, innovations, startups, and digital trends</li>
            <li><strong>Lifestyle:</strong> Health, fashion, food, travel, and wellness</li>
            <li><strong>Features:</strong> In-depth stories, interviews, and investigative journalism</li>
            <li><strong>Opinions:</strong> Editorials, columns, and diverse perspectives on important issues</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>Our Team</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            GH News is powered by a dedicated team of experienced journalists, editors, photographers, and digital media professionals who are passionate about delivering quality journalism. Our team includes:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li>Experienced reporters covering beats across Ghana</li>
            <li>Skilled editors ensuring accuracy and clarity</li>
            <li>Digital media specialists optimizing content for online audiences</li>
            <li>Photographers and videographers capturing compelling visuals</li>
            <li>Technology professionals building and maintaining our platform</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>Editorial Standards</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            At GH News, we adhere to the highest standards of journalism:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li><strong>Accuracy:</strong> We verify facts before publication and correct errors promptly</li>
            <li><strong>Fairness:</strong> We present all sides of a story and give subjects the opportunity to respond</li>
            <li><strong>Independence:</strong> Our editorial decisions are made independently, free from commercial or political influence</li>
            <li><strong>Transparency:</strong> We clearly distinguish between news, opinion, and advertising content</li>
            <li><strong>Ethics:</strong> We follow ethical guidelines in sourcing, reporting, and presenting information</li>
            <li><strong>Diversity:</strong> We strive to represent diverse voices and perspectives in our coverage</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>Our Commitment to Readers</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            We are committed to:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li>Delivering news that is accurate, timely, and relevant</li>
            <li>Maintaining editorial independence and integrity</li>
            <li>Protecting the privacy of our readers and sources</li>
            <li>Providing a platform for diverse voices and perspectives</li>
            <li>Engaging with our community and responding to feedback</li>
            <li>Continuously improving our platform and user experience</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>Contact Us</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            We value feedback from our readers. If you have questions, suggestions, or concerns, please don&apos;t hesitate to reach out:
          </p>
          <div style={{ backgroundColor: '#F3F4F6', padding: '20px', borderRadius: '8px', marginTop: '16px' }}>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '8px' }}>
              <strong>GH News</strong><br />
              Accra, Ghana<br />
              Email: <a href="mailto:ghnewsmedia7@gmail.com" style={{ color: '#2563EB', textDecoration: 'none' }}>ghnewsmedia7@gmail.com</a><br />
              Phone: <a href="tel:+233500651988" style={{ color: '#2563EB', textDecoration: 'none' }}>+233 (0) 50 065 1988</a>
            </p>
            <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '12px', marginBottom: 0 }}>
              For editorial inquiries, tips, or corrections, please email us with &quot;Editorial&quot; in the subject line.
            </p>
          </div>
        </section>
      </StaticPageLayout>
      <Footer />
    </>
  );
};

export default AboutPage;
