import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Home from './pages/Home.tsx';
import IndexPage from './pages/Index.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import AprovaOAB from './pages/AprovaOAB.tsx';
import CheckoutPage from './pages/Checkout.tsx';
import CheckoutSuccess from './pages/CheckoutSuccess.tsx';
import './index.css';

type PageKey =
  | 'home'
  | 'index'
  | 'admin'
  | 'admin-dashboard'
  | 'aprova-oab'
  | 'checkout'
  | 'checkout-success';

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
const TOKEN_KEY = 'pantheon:token';
const LAST_PAGE_KEY = 'pantheon:lastPage';
const LAST_SECTION_KEY = 'pantheon:lastAdminSection';

const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(window.localStorage.getItem(TOKEN_KEY));
};

const getStoredValue = (key: string) => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(key);
};

const hasAdminPermission = () => {
  if (!isAuthenticated()) return false;
  return window.localStorage.getItem(ADMIN_PERMISSION_KEY) === 'true';
};

const getInitialPage = (): PageKey => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase();
  if (path.startsWith('/aprova-oab')) return 'aprova-oab';
  if (path.startsWith('/checkout/success')) return 'checkout-success';
  if (path.startsWith('/checkout')) return 'checkout';
  if (!isAuthenticated()) return 'home';
  if (path.startsWith('/admin')) {
    return hasAdminPermission() ? 'admin-dashboard' : 'home';
  }
  if (path.startsWith('/index')) return 'index';
  const storedPage = getStoredValue(LAST_PAGE_KEY) as PageKey | null;
  if (storedPage) {
    if (storedPage === 'admin-dashboard' && !hasAdminPermission()) {
      return 'home';
    }
    return storedPage;
  }
  return 'home';
};

const getPathForPage = (page: PageKey) => {
  switch (page) {
    case 'admin-dashboard':
      return '/admin';
    case 'aprova-oab':
      return '/aprova-oab';
    case 'checkout':
      return '/checkout';
    case 'checkout-success':
      return '/checkout/success';
    case 'index':
      return '/index';
    case 'home':
    default:
      return '/';
  }
};

const RootApp = () => {
  const [currentPage, setCurrentPage] = React.useState<PageKey>(getInitialPage);
  const [adminSection, setAdminSection] = React.useState<string>(() => {
    const stored = getStoredValue(LAST_SECTION_KEY);
    return stored || 'dashboard';
  });
  const [checkoutPlan, setCheckoutPlan] = React.useState<string>('oab-1-fase-vitalicio');
  const [homeLoginOpen, setHomeLoginOpen] = React.useState(false);

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPage = (page: PageKey) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LAST_PAGE_KEY, page);
      const nextPath = getPathForPage(page);
      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, '', nextPath);
      }
    }
  };

  const ensureAuthenticated = () => {
    if (isAuthenticated()) return true;
    window.alert('Faca login para acessar.');
    navigateToPage('home');
    return false;
  };

  const goToAdmin = (section: string = 'dashboard') => {
    setAdminSection(section);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LAST_SECTION_KEY, section);
      window.localStorage.setItem(LAST_PAGE_KEY, 'admin');
    }
    setCurrentPage('admin');
  };

  const handleNavigate = (target: string) => {
    if (target.startsWith('checkout:')) {
      const planKey = target.replace('checkout:', '').trim();
      if (planKey) {
        setCheckoutPlan(planKey);
      }
      navigateToPage('checkout');
      return;
    }

    if (target === 'checkout') {
      navigateToPage('checkout');
      return;
    }

    if (target === 'checkout-success') {
      navigateToPage('checkout-success');
      return;
    }
    if (target === 'home') {
      setHomeLoginOpen(false);
      navigateToPage('home');
      return;
    }
    if (target === 'home:login') {
      setHomeLoginOpen(true);
      navigateToPage('home');
      return;
    }

    if (target === 'index') {
      if (!ensureAuthenticated()) return;
      navigateToPage('index');
      return;
    }

    if (target === 'admin-dashboard') {
      if (!ensureAuthenticated()) return;
      if (hasAdminPermission()) {
        navigateToPage('admin-dashboard');
      } else {
        window.alert('Acesso restrito: defina pantheon:isAdmin como true no localStorage para visualizar esta orea.');
      }
      return;
    }

    if (target === 'aprova-oab') {
      navigateToPage('aprova-oab');
      return;
    }

    const section = adminSectionMap[target];
    if (section) {
      if (!ensureAuthenticated()) return;
      goToAdmin(section);
      return;
    }

    if (target) {
      if (!ensureAuthenticated()) return;
      goToAdmin('dashboard');
    }
  };

  if (currentPage === 'admin') {
    return (
      <App
        initialSection={adminSection}
        onNavigateHome={() => navigateToPage('home')}
      />
    );
  }

  if (currentPage === 'admin-dashboard') {
    return <AdminDashboard onNavigate={handleNavigate} />;
  }

  if (currentPage === 'index') {
    return <IndexPage />;
  }

  if (currentPage === 'checkout') {
    return <CheckoutPage onNavigate={handleNavigate} planKey={checkoutPlan} />;
  }

  if (currentPage === 'checkout-success') {
    return <CheckoutSuccess onNavigate={handleNavigate} />;
  }

  if (currentPage === 'aprova-oab') {
    return <AprovaOAB onNavigate={handleNavigate} />;
  }

  return (
    <Home
      onNavigate={handleNavigate}
      openLoginOnLoad={homeLoginOpen}
      onLoginModalShown={() => setHomeLoginOpen(false)}
    />
  );
};

createRoot(document.getElementById('root')!).render(<RootApp />);
