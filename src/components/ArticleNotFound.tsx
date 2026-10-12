import Head from 'next/head';
import Link from 'next/link';

const ArticleNotFound = () => (
  <div className="gp-site flex min-h-screen items-center justify-center bg-white">
    <Head>
      <title>Article Not Found | Ghana Point</title>
      <meta name="robots" content="noindex, follow" />
    </Head>
    <div className="px-4 text-center">
      <h1 className="mb-4 text-4xl font-black text-gp-ink">Article Not Found</h1>
      <p className="mb-8 text-gp-muted">Sorry, the article you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="inline-block bg-gp-ink px-6 py-3 text-sm font-bold text-white hover:bg-black">
        Go Home
      </Link>
    </div>
  </div>
);

export default ArticleNotFound;
