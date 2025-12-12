import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Home from './pages/Home.tsx';
import IndexPage from './pages/Index.tsx';
import './index.css';

type PageKey = 'home' | 'index' | 'admin';

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

  if (currentPage === 'index') {
    return <IndexPage />;
  }

  return <Home onNavigate={handleNavigate} />;
};

createRoot(document.getElementById('root')!).render(<RootApp />);
