import StaticPageLayout from '@/components/StaticPageLayout';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock } from 'lucide-react';

const ContactPage = () => {
  return (
    <>
      <Header />
      <StaticPageLayout 
        title="Contact Us"
        description="Get in touch with GH News. Contact our editorial team, advertising department, or customer service. We're here to help."
        canonical="https://ghnewsmedia.com/contact"
      >
        <section style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '18px', lineHeight: '1.7', color: '#374151', marginBottom: '24px' }}>
            We&apos;d love to hear from you! Whether you have a news tip, advertising inquiry, feedback, or just want to get in touch, our team is here to help.
          </p>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
            <Mail size={32} style={{ color: '#2563EB', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px' }}>Email Us</h3>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px', lineHeight: '1.6' }}>
              Send us an email and we&apos;ll get back to you as soon as possible.
            </p>
            <a 
              href="mailto:ghnewsmedia7@gmail.com" 
              style={{ 
                color: '#2563EB', 
                textDecoration: 'none', 
                fontSize: '16px',
                fontWeight: '500',
                display: 'inline-block',
                marginTop: '8px'
              }}
            >
              ghnewsmedia7@gmail.com
            </a>
          </div>

          <div style={{ backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
            <Phone size={32} style={{ color: '#2563EB', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px' }}>Call Us</h3>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px', lineHeight: '1.6' }}>
              Give us a call during business hours.
            </p>
            <a 
              href="tel:+233500651988" 
              style={{ 
                color: '#2563EB', 
                textDecoration: 'none', 
                fontSize: '16px',
                fontWeight: '500',
                display: 'inline-block',
                marginTop: '8px'
              }}
            >
              +233 (0) 50 065 1988
            </a>
          </div>

          <div style={{ backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
            <MapPin size={32} style={{ color: '#2563EB', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px' }}>Visit Us</h3>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px', lineHeight: '1.6' }}>
              Our headquarters are located in Accra.
            </p>
            <p style={{ fontSize: '16px', color: '#374151', fontWeight: '500', marginTop: '8px' }}>
              Accra, Ghana
            </p>
          </div>

          <div style={{ backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
            <MessageCircle size={32} style={{ color: '#2563EB', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px' }}>WhatsApp</h3>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px', lineHeight: '1.6' }}>
              Join our WhatsApp channel for updates.
            </p>
            <a 
              href="https://whatsapp.com/channel/0029Vb66ViJK5cDJ8RjFSR2D"
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                color: '#2563EB', 
                textDecoration: 'none', 
                fontSize: '16px',
                fontWeight: '500',
                display: 'inline-block',
                marginTop: '8px'
              }}
            >
              Join Channel
            </a>
          </div>
        </div>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>Business Hours</h2>
          <div style={{ backgroundColor: '#EFF6FF', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <Clock size={24} style={{ color: '#2563EB', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '8px' }}>
                <strong>Monday - Friday:</strong> 9:00 AM - 5:00 PM GMT
              </p>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '8px' }}>
                <strong>Saturday:</strong> 10:00 AM - 2:00 PM GMT
              </p>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: 0 }}>
                <strong>Sunday:</strong> Closed
              </p>
              <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '12px', marginBottom: 0 }}>
                We typically respond to emails within 24-48 hours during business days.
              </p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>Contact by Department</h2>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px' }}>Editorial & News Tips</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '12px' }}>
              Have a news tip, story idea, or want to report an error? Contact our editorial team.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '8px' }}>
              Email: <a href="mailto:ghnewsmedia7@gmail.com?subject=Editorial Inquiry" style={{ color: '#2563EB', textDecoration: 'none' }}>ghnewsmedia7@gmail.com</a>
            </p>
            <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px' }}>
              Please include &quot;Editorial&quot; or &quot;News Tip&quot; in the subject line for faster response.
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px' }}>Advertising & Partnerships</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '12px' }}>
              Interested in advertising with us or exploring partnership opportunities?
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '8px' }}>
              Email: <a href="mailto:ghnewsmedia7@gmail.com?subject=Advertising Inquiry" style={{ color: '#2563EB', textDecoration: 'none' }}>ghnewsmedia7@gmail.com</a>
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '8px' }}>
              Phone: <a href="tel:+233500651988" style={{ color: '#2563EB', textDecoration: 'none' }}>+233 (0) 50 065 1988</a>
            </p>
            <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px' }}>
              Visit our <a href="/advertise" style={{ color: '#2563EB', textDecoration: 'none' }}>Advertising page</a> for more information.
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px' }}>General Inquiries</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '12px' }}>
              For general questions, feedback, or customer service inquiries.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '8px' }}>
              Email: <a href="mailto:ghnewsmedia7@gmail.com" style={{ color: '#2563EB', textDecoration: 'none' }}>ghnewsmedia7@gmail.com</a>
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px' }}>Press & Media</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '12px' }}>
              Media inquiries, press releases, or interview requests.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '8px' }}>
              Email: <a href="mailto:ghnewsmedia7@gmail.com?subject=Press Inquiry" style={{ color: '#2563EB', textDecoration: 'none' }}>ghnewsmedia7@gmail.com</a>
            </p>
            <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px' }}>
              Please include &quot;Press&quot; in the subject line.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>Follow Us</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            Stay connected with GH News on social media for the latest updates, breaking news, and exclusive content:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <a 
              href="https://x.com/ghnewsmedia?t=Fx80oa-73oEdgyznOxM_Yg&s=09"
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: '#000000',
                color: '#FFFFFF',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              <MessageCircle size={18} />
              X (Twitter)
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=61577876216304&mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: '#1877F2',
                color: '#FFFFFF',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              <MessageCircle size={18} />
              Facebook
            </a>
            <a 
              href="https://youtube.com/@ghnewsmedia?si=X7l2KfRAkWHG2bAu"
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: '#FF0000',
                color: '#FFFFFF',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              <MessageCircle size={18} />
              YouTube
            </a>
            <a 
              href="https://whatsapp.com/channel/0029Vb66ViJK5cDJ8RjFSR2D"
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              <MessageCircle size={18} />
              WhatsApp Channel
            </a>
          </div>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>We&apos;re Here to Help</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            At GH News, we value your feedback and are committed to providing excellent service. Whether you have a question, suggestion, concern, or just want to say hello, we&apos;re here to listen and help.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: 0 }}>
            Thank you for being part of the GH News community!
          </p>
        </section>
      </StaticPageLayout>
      <Footer />
    </>
  );
};

export default ContactPage;
