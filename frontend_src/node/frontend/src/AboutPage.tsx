import React from 'react';
import Layout from './Layout';

const LinkButton = ({ href, text }: { href: string; text: string }) => (
  <a href={href} className="link-button" style={{ margin: '0 1rem', textDecoration: 'none' }}>
    {text}
  </a>
);

const TopPage: React.FC = () => {
  return (
    <Layout>
      <div>I am AboutPage</div>
    </Layout>
  );
};

export default TopPage;
