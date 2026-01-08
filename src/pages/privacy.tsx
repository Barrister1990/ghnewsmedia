import StaticPageLayout from '@/components/StaticPageLayout';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Header />
      <StaticPageLayout 
        title="Privacy Policy"
        description="Learn how GH News collects, uses, and protects your personal information. Our comprehensive privacy policy explains your rights and our data practices."
        canonical="https://ghnewsmedia.com/privacy"
      >
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>1. Introduction</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            GH News (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website ghnewsmedia.com (the &quot;Site&quot;). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>2. Information We Collect</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            We may collect information about you in a variety of ways. The information we may collect on the Site includes:
          </p>
          
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px', marginTop: '24px' }}>2.1 Personal Data</h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            Personally identifiable information that you voluntarily give to us when registering with the Site or when you choose to participate in various activities related to the Site, such as:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li>Name and contact information (email address, phone number)</li>
            <li>Demographic information (age, gender, location)</li>
            <li>Account credentials (username, password)</li>
            <li>Profile information and preferences</li>
          </ul>

          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px', marginTop: '24px' }}>2.2 Derivative Data</h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            Information our servers automatically collect when you access the Site, such as:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li>IP address and browser type</li>
            <li>Operating system and device information</li>
            <li>Pages you visit and time spent on pages</li>
            <li>Referring website addresses</li>
            <li>Search terms used to find our Site</li>
          </ul>

          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px', marginTop: '24px' }}>2.3 Cookies and Tracking Technologies</h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            We use cookies, web beacons, and similar tracking technologies to track activity on our Site and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            We use both session cookies (which expire once you close your web browser) and persistent cookies (which stay on your device until you delete them) to provide you with a more personalized experience on our Site. You can control cookies through your browser settings, but note that disabling cookies may limit your ability to use certain features of our Site.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            Types of cookies we use:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li><strong>Essential Cookies:</strong> Required for the Site to function properly</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our Site</li>
            <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements and track ad performance</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>3. How We Use Your Information</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li>Create and manage your account</li>
            <li>Email you regarding your account or order</li>
            <li>Fulfill and manage purchases, orders, payments, and other transactions</li>
            <li>Generate a personal profile about you to make future visits more personalized</li>
            <li>Increase the efficiency and operation of the Site</li>
            <li>Monitor and analyze usage and trends to improve your experience</li>
            <li>Notify you of updates to the Site</li>
            <li>Perform other business activities as needed</li>
            <li>Request feedback and contact you about your use of the Site</li>
            <li>Resolve disputes and troubleshoot problems</li>
            <li>Respond to product and customer service requests</li>
            <li>Send you a newsletter</li>
            <li>Solicit support for the Site</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>4. Advertising and Third-Party Services</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            Our Site displays advertisements to help support our operations and provide you with free access to content. We work with third-party advertising partners to deliver these ads.
          </p>
          
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px', marginTop: '24px' }}>4.1 Google AdSense</h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            We use Google AdSense to display ads on our Site. Google AdSense is a program that allows website owners to display targeted advertisements to users. When you visit our Site, Google may use cookies and similar technologies to:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li>Show you ads based on your visits to this Site and other websites</li>
            <li>Personalize the ads you see based on your interests and browsing behavior</li>
            <li>Measure the effectiveness of advertisements</li>
            <li>Prevent fraud and abuse</li>
          </ul>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            Google may use cookies to show ads to users based on their visits to this and other websites. You can learn more about how Google uses data when you visit our Site by visiting <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', textDecoration: 'none' }}>Google&apos;s Advertising Privacy & Terms</a>.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', textDecoration: 'none' }}>Google&apos;s Ad Settings</a> or by using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', textDecoration: 'none' }}>Google Analytics Opt-out Browser Add-on</a>.
          </p>

          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px', marginTop: '24px' }}>4.2 Third-Party Ad Vendors</h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            In addition to Google AdSense, we may work with other third-party advertising networks and vendors to display advertisements on our Site. These third-party ad vendors may use cookies, web beacons, and other tracking technologies to collect information about your online activities across different websites and over time.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            Third-party ad vendors may use this information to:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li>Display targeted advertisements based on your interests and browsing history</li>
            <li>Measure ad performance and effectiveness</li>
            <li>Provide analytics and reporting services</li>
            <li>Prevent fraudulent activity</li>
          </ul>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            These third-party vendors have their own privacy policies and terms of service. We encourage you to review their policies to understand how they collect, use, and share your information.
          </p>

          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px', marginTop: '24px' }}>4.3 Opting Out of Interest-Based Advertising</h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            You have the right to opt out of interest-based advertising. You can do this by:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li>Visiting the <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', textDecoration: 'none' }}>Digital Advertising Alliance&apos;s opt-out page</a></li>
            <li>Visiting the <a href="http://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', textDecoration: 'none' }}>European Interactive Digital Advertising Alliance&apos;s opt-out page</a> (for EU users)</li>
            <li>Adjusting your browser settings to block or limit cookies</li>
            <li>Using browser extensions that block tracking</li>
          </ul>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            Please note that opting out does not mean you will no longer see advertisements. You will still see ads, but they may be less relevant to your interests.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>5. Disclosure of Your Information</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
          </p>
          
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px', marginTop: '24px' }}>4.1 By Law or to Protect Rights</h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
          </p>

          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px', marginTop: '24px' }}>4.2 Third-Party Service Providers</h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
          </p>

          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111111', marginBottom: '12px', marginTop: '24px' }}>4.3 Business Transfers</h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>6. Data Security</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>6. Your Rights</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            Depending on your location, you may have the following rights regarding your personal information:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li>The right to access – You have the right to request copies of your personal data</li>
            <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate</li>
            <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions</li>
            <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data</li>
            <li>The right to object to processing – You have the right to object to our processing of your personal data</li>
            <li>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>8. Children&apos;s Privacy</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            Our Site is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>9. Changes to This Privacy Policy</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            We may update this Privacy Policy from time to time in order to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>10. Contact Us</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            If you have questions or comments about this Privacy Policy, please contact us at:
          </p>
          <div style={{ backgroundColor: '#F3F4F6', padding: '20px', borderRadius: '8px', marginTop: '16px' }}>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '8px' }}>
              <strong>GH News</strong><br />
              Accra, Ghana<br />
              Email: <a href="mailto:ghnewsmedia7@gmail.com" style={{ color: '#2563EB', textDecoration: 'none' }}>ghnewsmedia7@gmail.com</a><br />
              Phone: <a href="tel:+233500651988" style={{ color: '#2563EB', textDecoration: 'none' }}>+233 (0) 50 065 1988</a>
            </p>
          </div>
        </section>
      </StaticPageLayout>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
