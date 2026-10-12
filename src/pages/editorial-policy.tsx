import Footer from '@/components/Footer';
import Header from '@/components/Header';
import StaticPageLayout from '@/components/StaticPageLayout';
import { CONTACT_EMAIL, SITE_URL } from '@/config/site';
import Link from 'next/link';

/** Legal owner shown in the Ownership section; Google News expects the real publisher to be named. */
const PUBLISHER_ENTITY = 'Ghana Point';
const CONTACT_PHONE = { href: 'tel:+233500651988', label: '+233 (0) 50 065 1988' };

const EditorialPolicyPage = () => (
  <>
    <Header />
    <StaticPageLayout
      title="Editorial Policy"
      description="How Ghana Point reports, verifies, corrects and labels the news — our standards, ownership and how to reach the newsroom."
      canonical={`${SITE_URL}/editorial-policy`}
    >
      <section id="mission">
        <h2>Our mission</h2>
        <p>
          Ghana Point publishes accurate, timely and fair news about Ghana for readers at home and in the diaspora.
          Our coverage spans politics, business, sports, entertainment, technology, lifestyle, features and opinion.
        </p>
      </section>

      <section id="ownership">
        <h2>Ownership and funding</h2>
        <p>
          This website is published by {PUBLISHER_ENTITY}, based in Accra, Ghana. Ghana Point is funded by advertising.
          Advertisers have no say in what we cover or how we cover it, and advertisements are always labelled
          &ldquo;Advertisement&rdquo; and kept visually separate from journalism.
        </p>
      </section>

      <section id="ethics">
        <h2>Editorial standards and ethics</h2>
        <ul>
          <li><strong>Accuracy.</strong> We report what we can verify and say clearly when facts are unconfirmed.</li>
          <li><strong>Fairness.</strong> People and organisations facing serious allegations are given a chance to respond before publication.</li>
          <li><strong>Independence.</strong> Editorial decisions are made by our editors, free from political, commercial or personal influence. Staff declare conflicts of interest and step away from stories they affect.</li>
          <li><strong>Sourcing.</strong> We name sources wherever possible. Anonymous sources are used only when the information is important, cannot be obtained on the record, and an editor knows the source&apos;s identity.</li>
          <li><strong>Originality.</strong> We credit other outlets when we follow their reporting and never present others&apos; work as our own.</li>
          <li><strong>Harm.</strong> We take particular care with children, victims of crime and people in grief, and we do not publish graphic material without clear public-interest value.</li>
        </ul>
      </section>

      <section id="fact-checking">
        <h2>Verification and fact-checking</h2>
        <p>
          Every story is checked by an editor before publication. Figures, quotes, names and titles are checked against
          primary sources such as official documents, recordings and direct interviews. Images and videos from social
          media are verified for origin and date before use, and we say so when we cannot independently verify them.
        </p>
      </section>

      <section id="corrections">
        <h2>Corrections and updates</h2>
        <p>
          When we get something wrong, we fix it promptly and openly. Significant corrections are noted at the end of the
          article with the date of the correction. When a story develops, we update it and show the time of the latest
          update below the headline; we do not change publication dates to make old stories look new.
        </p>
        <p>
          To report an error, email <a href={`mailto:${CONTACT_EMAIL}?subject=Correction`}>{CONTACT_EMAIL}</a> with
          the article link and the correction needed.
        </p>
      </section>

      <section id="labels">
        <h2>News, opinion and sponsored content</h2>
        <p>
          News reports present facts. Pieces in our <Link href="/opinions">Opinion</Link> section are the views of their
          authors and are labelled as opinion. Sponsored or paid content, when published, is clearly labelled as such and
          is never presented as independent reporting.
        </p>
      </section>

      <section id="authors">
        <h2>Bylines and our journalists</h2>
        <p>
          Every article carries the name of the journalist or editor responsible, the date and time of publication, and
          the time of any significant update. Profiles of our writers are on the{' '}
          <Link href="/authors">Our Journalists</Link> page.
        </p>
      </section>

      <section id="feedback">
        <h2>Contact the newsroom</h2>
        <p>
          We welcome feedback, story tips and complaints. Email{' '}
          <a href={`mailto:${CONTACT_EMAIL}?subject=Editorial`}>{CONTACT_EMAIL}</a> or call{' '}
          <a href={CONTACT_PHONE.href}>{CONTACT_PHONE.label}</a>. More ways to reach us are on our{' '}
          <Link href="/contact">Contact</Link> page.
        </p>
      </section>
    </StaticPageLayout>
    <Footer />
  </>
);

export default EditorialPolicyPage;
