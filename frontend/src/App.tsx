import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from '@/pages/HomePageNew';
import LandingPage from '@/pages/LandingPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import NewsListPage from '@/pages/NewsListPage';
import NewsDetailPage from '@/pages/NewsDetailPage';
import NewsAdminPage from '@/pages/NewsAdminPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AdminPage from '@/pages/AdminPage';
import CookieBanner from '@/components/CookieBanner';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<HomePage />} />
          <Route path="/app/*" element={<HomePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/news" element={<NewsListPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
          <Route path="/admin/news" element={<NewsAdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        
        <CookieBanner />
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;