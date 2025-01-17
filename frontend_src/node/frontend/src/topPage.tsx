import React from 'react';
import Layout from './Layout';
import { Link } from 'react-router-dom';

const TopPage: React.FC = () => {
  return (
    <Layout>
      <div style={{ marginTop: '100pt' }}>
        I am TopPage
        <Link to="/game">
          ゲームスタート
        </Link>
      </div>
    </Layout>
  );
};

export default TopPage;
