import Footer from '@/components/Footer';
import Header from '@/components/Header';
import StaticPageLayout from '@/components/StaticPageLayout';

const TermsOfServicePage = () => {
  return (
    <>
      <Header />
      <StaticPageLayout 
        title="Terms of Service"
        description="Read GH News Terms of Service. Understand the rules and guidelines for using our platform and accessing our content."
        canonical="https://ghnewsmedia.com/terms"
      >
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>1. Agreement to Terms</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;you&quot;), and GH News (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), concerning your access to and use of the ghnewsmedia.com website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the &quot;Site&quot;).
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms of Use. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF USE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>2. Intellectual Property Rights</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the &quot;Content&quot;) and the trademarks, service marks, and logos contained therein (the &quot;Marks&quot;) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            The Content and the Marks are provided on the Site &quot;AS IS&quot; for your information and personal use only. Except as expressly provided in these Terms of Use, no part of the Site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>3. User Representations</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            By using the Site, you represent and warrant that:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li>All registration information you submit will be true, accurate, current, and complete</li>
            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary</li>
            <li>You have the legal capacity and you agree to comply with these Terms of Use</li>
            <li>You are not a minor in the jurisdiction in which you reside</li>
            <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise</li>
            <li>You will not use the Site for any illegal or unauthorized purpose</li>
            <li>Your use of the Site will not violate any applicable law or regulation</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>4. Prohibited Activities</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            As a user of the Site, you agree not to:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li>Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us</li>
            <li>Make any unauthorized use of the Site, including collecting usernames and/or email addresses of users by electronic or other means</li>
            <li>Use the Site to advertise or offer to sell goods and services</li>
            <li>Circumvent, disable, or otherwise interfere with security-related features of the Site</li>
            <li>Engage in unauthorized framing of or linking to the Site</li>
            <li>Trick, defraud, or mislead us and other users</li>
            <li>Make improper use of our support services or submit false reports of abuse or misconduct</li>
            <li>Engage in any automated use of the system, such as using scripts to send comments or messages</li>
            <li>Interfere with, disrupt, or create an undue burden on the Site or the networks or services connected to the Site</li>
            <li>Attempt to impersonate another user or person or use the username of another user</li>
            <li>Use any information obtained from the Site in order to harass, abuse, or harm another person</li>
            <li>Use the Site as part of any effort to compete with us or otherwise use the Site and/or the Content for any revenue-generating endeavor or commercial enterprise</li>
            <li>Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Site</li>
            <li>Attempt to bypass any measures of the Site designed to prevent or restrict access to the Site, or any portion of the Site</li>
            <li>Delete the copyright or other proprietary rights notice from any Content</li>
            <li>Copy or adapt the Site&apos;s software, including but not limited to Flash, PHP, HTML, JavaScript, or other code</li>
            <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material that interferes with any party&apos;s uninterrupted use and enjoyment of the Site</li>
            <li>Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Site to you</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>5. User Generated Contributions</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            The Site may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Site, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, &quot;Contributions&quot;).
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            Contributions may be viewable by other users of the Site and through third-party websites. As such, any Contributions you transmit may be treated as non-confidential and non-proprietary. When you create or make available any Contributions, you thereby represent and warrant that:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li>The creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party</li>
            <li>You are the creator and owner of or have the necessary licenses, rights, consents, releases, and permissions to use and to authorize us, the Site, and other users of the Site to use your Contributions in any manner contemplated by the Site and these Terms of Use</li>
            <li>Your Contributions are not false, inaccurate, or misleading</li>
            <li>Your Contributions are not unsolicited or unauthorized advertising, promotional materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of solicitation</li>
            <li>Your Contributions do not violate the privacy or publicity rights of any third party</li>
            <li>Your Contributions do not contain any material that solicits personal information from anyone under the age of 18 or exploits people under the age of 18 in a sexual or violent manner</li>
            <li>Your Contributions do not violate any applicable law concerning child pornography, or otherwise intended to protect the health or well-being of minors</li>
            <li>Your Contributions do not include any offensive comments that are connected to race, national origin, gender, sexual preference, or physical handicap</li>
            <li>Your Contributions do not otherwise violate, or link to material that violates, any provision of these Terms of Use, or any applicable law or regulation</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>6. Site Management</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            We reserve the right, but not the obligation, to:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginLeft: '24px', marginBottom: '16px' }}>
            <li>Monitor the Site for violations of these Terms of Use</li>
            <li>Take appropriate legal action against anyone who, in our sole discretion, violates the law or these Terms of Use</li>
            <li>Refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof</li>
            <li>Remove from the Site or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems</li>
            <li>Otherwise manage the Site in a manner designed to protect our rights and property and to facilitate the proper functioning of the Site</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>7. Modifications and Interruptions</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>8. Governing Law</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            These Terms of Use and your use of the Site are governed by and construed in accordance with the laws of the Republic of Ghana, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms of Use will be brought exclusively in the courts located in Accra, Ghana.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', marginBottom: '16px', marginTop: '32px' }}>9. Contact Us</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
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

export default TermsOfServicePage;
