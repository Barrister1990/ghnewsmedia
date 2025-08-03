
import StaticPageLayout from '@/components/StaticPageLayout';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';

const AdvertisePage = () => {
  return (
    <StaticPageLayout title="Advertise With Us">
      <h2>Reach Ghana&apos;s Most Engaged Audience</h2>
      <p>GhNewsMedia offers a unique opportunity to connect with a diverse, engaged, and influential audience across Ghana and beyond. Our readers are educated, affluent, and passionate about staying informed on the latest in politics, business, technology, and culture.</p>
      
      <div className="my-8 p-6 bg-blue-50 border-l-4 border-news-blue rounded-r-lg">
        <h3 className="text-xl font-semibold text-news-blue">Why Advertise with GhNewsMedia?</h3>
        <ul className="list-disc list-inside mt-4 space-y-2">
            <li><strong>Unparalleled Reach:</strong> Access millions of monthly unique visitors.</li>
            <li><strong>Targeted Demographics:</strong> Connect with specific audience segments.</li>
            <li><strong>High Engagement:</strong> Our readers spend significant time on our platform.</li>
            <li><strong>Trusted Environment:</strong> Align your brand with a credible news source.</li>
        </ul>
      </div>

      <h2>Our Advertising Solutions</h2>
      <p>We offer a range of advertising solutions, including display advertising, sponsored content, and newsletter sponsorship to meet your marketing objectives.</p>

      <h2>Get in Touch</h2>
      <p>Our advertising team is ready to create a customized package that meets your brand&apos;s needs. Contact us today to receive our media kit and discuss your campaign.</p>

      <div className="mt-6 flex flex-col sm:flex-row gap-6 items-start">
        <div className="flex items-center">
            <Mail className="w-5 h-5 mr-3 text-accent" />
            <div>
                <h4 className="font-semibold">Email Us</h4>
                <a href="mailto:ghnewsmedia7@gmail.com" className="text-news-blue hover:underline">ghnewsmedia7@gmail.com</a>
            </div>
        </div>
        <div className="flex items-center">
            <Phone className="w-5 h-5 mr-3 text-accent" />
            <div>
                <h4 className="font-semibold">Call Us</h4>
                <p>+233 (0) 50 065 1988</p>
            </div>
        </div>
      </div>
      
      <div className="mt-10 text-center">
        <Button size="lg" className="bg-accent hover:bg-accent-600 text-white">
          Download Our Media Kit
        </Button>
      </div>

    </StaticPageLayout>
  );
};

export default AdvertisePage;
