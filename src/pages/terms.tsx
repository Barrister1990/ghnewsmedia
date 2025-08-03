
import StaticPageLayout from '@/components/StaticPageLayout';

const TermsOfServicePage = () => {
  return (
    <StaticPageLayout title="Terms of Service">
      <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <h2>Agreement to Terms</h2>
      <p>These Terms of Use constitute a legally binding agreement made between you and GhNewsMedia concerning your access to and use of the website. You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms of Use.</p>

      <h2>Intellectual Property Rights</h2>
      <p>The Site and its original content, features, and functionality are owned by GhNewsMedia and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>

      <h2>User Representations</h2>
      <p>By using the Site, you represent and warrant that: (1) you have the legal capacity and you agree to comply with these Terms of Use; (2) you will not access the Site through automated or non-human means; (3) your use of the Site will not violate any applicable law or regulation.</p>

      <h2>Contact Us</h2>
      <p>To resolve a complaint or receive further information, please contact us at:</p>
      <p>
        GhNewsMedia<br/>
        <br/>
        Accra, Ghana<br/>
        Email: ghnewsmedia7@gmail.com
      </p>
    </StaticPageLayout>
  );
};

export default TermsOfServicePage;
