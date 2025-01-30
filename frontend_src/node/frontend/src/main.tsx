import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'; // Redux の Provider をインポート
import { store } from './store'; // Redux ストアをインポート
import TopPage from './topPage';
import AboutPage from './AboutPage';
import NotFoundPage from './NotFoundPage';
import LoginPage from './LoginPage';
import AccountRegisterPage from './AccountRegisterPage';
import DashboardPage from './DashboardPage';
import GamePage from './GamePage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}> {/* Redux Provider でラップ */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account-register" element={<AccountRegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
