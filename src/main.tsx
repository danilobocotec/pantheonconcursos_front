import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Home from './pages/Home.tsx';
import IndexPage from './pages/Index.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import './index.css';

type PageKey = 'home' | 'index' | 'admin' | 'admin-dashboard';

const adminSectionMap: Record<string, string> = {
  'visao-geral': 'dashboard',
  dashboard: 'dashboard',
  'plano-estudos': 'plano-estudos',
  courses: 'courses',
  'aprova-oab': 'courses',
  vademecum: 'vademecum',
  mindmaps: 'mindmaps',
  MapasMentais: 'mindmaps',
  settings: 'settings',
};

const ADMIN_PERMISSION_KEY = 'pantheon:isAdmin';

const hasAdminPermission = () => {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(ADMIN_PERMISSION_KEY) === 'true';
};

const RootApp = () => {
  const [currentPage, setCurrentPage] = React.useState<PageKey>('home');
  const [adminSection, setAdminSection] = React.useState<string>('dashboard');

  const goToAdmin = (section: string = 'dashboard') => {
    setAdminSection(section);
    setCurrentPage('admin');
  };

  const handleNavigate = (target: string) => {
    if (target === 'home') {
      setCurrentPage('home');
      return;
    }

    if (target === 'index') {
      setCurrentPage('index');
      return;
    }

    if (target === 'admin-dashboard') {
      if (hasAdminPermission()) {
        setCurrentPage('admin-dashboard');
      } else {
        window.alert('Acesso restrito: defina pantheon:isAdmin como true no localStorage para visualizar esta área.');
      }
      return;
    }

    const section = adminSectionMap[target];
    if (section) {
      goToAdmin(section);
      return;
    }

    if (target) {
      goToAdmin('dashboard');
    }
  };

  if (currentPage === 'admin') {
    return (
      <App
        initialSection={adminSection}
        onNavigateHome={() => setCurrentPage('home')}
      />
    );
  }

  if (currentPage === 'admin-dashboard') {
    return <AdminDashboard onNavigate={handleNavigate} />;
  }

  if (currentPage === 'index') {
    return <IndexPage />;
  }

  return <Home onNavigate={handleNavigate} />;
};

createRoot(document.getElementById('root')!).render(<RootApp />);
