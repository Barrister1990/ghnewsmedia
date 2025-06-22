
import StaticPageLayout from '@/components/StaticPageLayout';
import { Button } from '@/components/ui/button';

const JobOpening = ({ title, location, type }: { title: string, location: string, type: string }) => (
  <div className="border rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
    <div>
      <h3 className="text-xl font-semibold text-news-blue">{title}</h3>
      <p className="text-gray-600 mt-1">{location} &bull; {type}</p>
    </div>
    <Button variant="outline" className="mt-4 sm:mt-0 shrink-0">Apply Now</Button>
  </div>
);

const CareersPage = () => {
  const openings = [
    { title: 'Senior Journalist, Politics Desk', location: 'Accra, Ghana', type: 'Full-time' },
    { title: 'Digital Marketing Manager', location: 'Accra, Ghana', type: 'Full-time' },
    { title: 'Frontend Developer (React)', location: 'Remote', type: 'Contract' },
    { title: 'Sales Executive, Advertising', location: 'Kumasi, Ghana', type: 'Full-time' },
  ];

  return (
    <StaticPageLayout title="Careers at GhNewsMedia">
      <h2>Join Our Mission to Inform and Inspire</h2>
      <p>At GhNewsMedia, we are dedicated to delivering high-quality news and analysis. If you are driven, curious, and committed to excellence, we invite you to explore a career with us.</p>
      
      <div className="my-8 p-6 bg-blue-50 border-l-4 border-news-blue rounded-r-lg grid md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold text-news-blue">Competitive Salary</h4>
          <p className="text-sm text-gray-700 mt-1">Valuing your skills and experience.</p>
        </div>
        <div>
          <h4 className="font-semibold text-news-blue">Health & Wellness</h4>
          <p className="text-sm text-gray-700 mt-1">Comprehensive health insurance.</p>
        </div>
        <div>
          <h4 className="font-semibold text-news-blue">Professional Growth</h4>
          <p className="text-sm text-gray-700 mt-1">Training and mentorship opportunities.</p>
        </div>
      </div>

      <h2>Current Openings</h2>
      <div className="mt-8 space-y-6">
        {openings.length > 0 ? openings.map((job, index) => (
          <JobOpening key={index} {...job} />
        )) : <p>There are no open positions at the moment. Please check back later.</p>}
      </div>

      <div className="mt-10 text-center bg-gray-100 p-8 rounded-lg">
        <h3 className="text-2xl font-bold">Don&apos;t see your dream job?</h3>
        <p className="mt-2 text-gray-600">We&apos;re always looking for great talent. Send your CV to our HR team.</p>
        <Button size="lg" className="mt-6 bg-accent hover:bg-accent-600 text-white">
          Submit Speculative Application
        </Button>
      </div>
    </StaticPageLayout>
  );
};

export default CareersPage;
