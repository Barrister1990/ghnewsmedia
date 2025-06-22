
import StaticPageLayout from '../components/StaticPageLayout';

const PrivacyPolicyPage = () => {
  return (
    <StaticPageLayout title="Privacy Policy">
      <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <h2>Introduction</h2>
      <p>GhNewsMedia (we, our, or us) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>

      <h2>Information We Collect</h2>
      <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
      <ul>
        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and demographic information that you voluntarily give to us.</li>
        <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, browser type, and operating system.</li>
      </ul>

      <h2>Use of Your Information</h2>
      <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to create and manage your account, email you regarding your account, and generate a personal profile about you to make future visits more personalized.</p>

      <h2>Contact Us</h2>
      <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
      <p>
        GhNewsMedia<br/>
        123 Independence Avenue<br/>
        Accra, Ghana<br/>
        Email: privacy@ghnewsmedia.com
      </p>
    </StaticPageLayout>
  );
};

export default PrivacyPolicyPage;
