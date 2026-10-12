// pages/indexnow-key.txt.tsx - IndexNow ownership file (contents must equal INDEXNOW_KEY)
import { GetServerSideProps } from 'next';

const IndexNowKey = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return { notFound: true };
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400');
  res.write(key);
  res.end();

  return { props: {} };
};

export default IndexNowKey;
