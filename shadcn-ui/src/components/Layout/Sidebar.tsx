import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  BookOpen, 
  Scale, 
  Brain, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight,
  ChevronUp,
  Home,
  User,
  UserCircle,
  Menu,
  X,
  Sun,
  Moon,
  FileText,
  Shield,
  LogOut,
  Calendar
} from 'lucide-react';
import { media } from '../../styles/GlobalStyles';
import { clearAuthToken } from '../../lib/auth';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
}

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  width: 280px;
  height: 100vh;
  background: ${props => props.theme.colors.background};
  border-right: 1px solid ${props => props.theme.colors.border};
  transition: transform 0.3s ease;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;

  ${media.mobile} {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.isOpen ? '0 0 20px rgba(0, 0, 0, 0.3)' : 'none'};
  }

  @media (min-width: 769px) {
    transform: translateX(0);
  }
`;

const MobileOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: ${props => props.isOpen ? 'block' : 'none'};
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  position: fixed !important;
  top: 16px !important;
  left: 16px !important;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: none;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px ${props => props.theme.colors.shadow};
  transition: all 0.2s ease;
  z-index: 9999 !important;
  border: 1px solid ${props => props.theme.colors.border};
  transform: none !important;

  &:hover {
    background: ${props => props.theme.colors.accent};
    color: white;
    transform: scale(1.05) !important;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const Logo = styled.div<{ isDarkMode?: boolean }>`
  padding: 24px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  img {
    max-width: 100%;
    height: auto;
    max-height: 50px;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    padding-top: 60px;
  }
`;

const MenuSection = styled.div`
  padding: 16px 0;
  flex: 1;
  overflow-y: auto;
`;

const MenuItem = styled.div<{ active?: boolean; hasSubmenu?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.text};
  background: ${props => props.active ? `${props.theme.colors.accent}15` : 'transparent'};
  border-right: ${props => props.active ? `3px solid ${props.theme.colors.accent}` : 'none'};

  &:hover {
    background: ${props => props.theme.colors.accent}10;
    color: ${props => props.theme.colors.accent};
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: 12px;
    flex-shrink: 0;
  }

  span {
    flex: 1;
    font-weight: ${props => props.active ? '600' : '400'};
  }
`;

const SubMenu = styled.div<{ isOpen: boolean }>`
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  background: ${props => props.theme.colors.background};
`;

const SubMenuItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 20px 10px 52px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.textSecondary};
  font-size: 14px;

  &:hover {
    background: ${props => props.theme.colors.accent}10;
    color: ${props => props.theme.colors.accent};
  }
`;

const MobileThemeToggle = styled.div`
  display: none;
  padding: 12px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  flex-shrink: 0;

  ${media.mobile} {
    display: block;
  }
`;

const ThemeButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.accent}10;
    color: ${props => props.theme.colors.accent};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const UserSection = styled.div`
  padding: 16px 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  flex-shrink: 0;
  margin-top: auto;
  position: relative;
`;

const UserButton = styled.button<{ isOpen: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.accent}10;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${props => props.theme.colors.accent};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    flex-shrink: 0;
  }

  .info {
    flex: 1;
    text-align: left;
    
    .name {
      font-weight: 600;
      font-size: 14px;
      color: ${props => props.theme.colors.text};
      margin-bottom: 2px;
    }
    
    .role {
      font-size: 12px;
      color: ${props => props.theme.colors.textSecondary};
    }
  }

  .chevron {
    color: ${props => props.theme.colors.textSecondary};
    transition: transform 0.2s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const UserDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 16px;
  right: 16px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 12px ${props => props.theme.colors.shadow};
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(10px)'};
  transition: all 0.2s ease;
  z-index: 1001;
  margin-bottom: 8px;
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  text-align: left;

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  &:only-child {
    border-radius: 8px;
  }

  &:hover {
    background: ${props => props.theme.colors.accent}10;
    color: ${props => props.theme.colors.accent};
  }

  &.logout {
    color: ${props => props.theme.colors.error};
    border-top: 1px solid ${props => props.theme.colors.border};

    &:hover {
      background: ${props => props.theme.colors.error}10;
      color: ${props => props.theme.colors.error};
    }
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, isDarkMode, onThemeToggle }) => {
    const [userFullName, setUserFullName] = useState('Usuário');

    useEffect(() => {
      if (typeof window !== 'undefined') {
        setUserFullName(window.localStorage.getItem('pantheon:fullName') || 'Usuário');
      }
    }, []);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    courses: false,
    questions: false
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleNavItemClick = (section: string) => {
    onSectionChange(section);
    if (isMobile) {
      setIsOpen(false);
    }
    setUserDropdownOpen(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleUserAction = (action: string) => {
    switch (action) {
      case 'account':
        handleNavItemClick('settings');
        break;
      case 'terms':
        console.log('Navegando para Termos de Uso');
        break;
      case 'privacy':
        console.log('Navegando para Política de Privacidade');
        break;
      case 'logout':
        clearAuthToken();
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('pantheon:fullName');
          window.localStorage.removeItem('pantheon:role');
          window.localStorage.removeItem('pantheon:lastEmail');
          window.localStorage.removeItem('pantheon:lastPage');
          window.localStorage.removeItem('pantheon:lastAdminSection');
          window.location.href = '/';
        }
        break;
    }
    setUserDropdownOpen(false);
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Visão Geral',
      icon: Home,
      section: 'dashboard'
    },
    {
      id: 'plano-estudos',
      label: 'Plano de Estudos',
      icon: Calendar,
      section: 'plano-estudos'
    },
    {
      id: 'courses',
      label: 'Meus Cursos',
      icon: BookOpen,
      section: 'courses'
    },
    {
      id: 'vademecum',
      label: 'Vade Mecum',
      icon: Scale,
      section: 'vademecum'
    },
    {
      id: 'mindmaps',
      label: 'Mapas Mentais',
      icon: Brain,
      section: 'mindmaps'
    },
    {
      id: 'questions',
      label: 'Sistema de Questões',
      icon: HelpCircle,
      hasSubmenu: true,
      submenu: [
        { id: 'questions-objective', label: 'Questões Objetivas', section: 'questions-objective' },
        { id: 'questions-discursive', label: 'Questões Discursivas', section: 'questions-discursive' },
        { id: 'questions-exams', label: 'Provas Comentadas', section: 'questions-exams' },
        { id: 'questions-simulations', label: 'Simulados', section: 'questions-simulations' },
        { id: 'questions-performance', label: 'Meu Desempenho', section: 'questions-performance' }
      ]
    }
  ];

  return (
    <>
      <MobileMenuButton onClick={toggleSidebar}>
        <Menu size={20} />
      </MobileMenuButton>

      <MobileOverlay isOpen={isOpen} onClick={closeSidebar} />

      <SidebarContainer isOpen={isOpen}>
        <CloseButton onClick={closeSidebar}>
          <X size={16} />
        </CloseButton>

        <Logo isDarkMode={isDarkMode}>
          <img 
            src={isDarkMode ? "/logo-pantheon-dark.png" : "/logo-pantheon.png"} 
            alt="Pantheon Concursos" 
          />
        </Logo>

        {isMobile && onThemeToggle && (
          <MobileThemeToggle>
            <ThemeButton onClick={onThemeToggle}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span>{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
            </ThemeButton>
          </MobileThemeToggle>
        )}

        <MenuSection>
          {menuItems.map(item => (
            <div key={item.id}>
              <MenuItem
                active={activeSection === item.section || (item.submenu && item.submenu.some(sub => sub.section === activeSection))}
                hasSubmenu={item.hasSubmenu}
                onClick={() => {
                  if (item.hasSubmenu) {
                    toggleMenu(item.id);
                  } else if (item.section) {
                    handleNavItemClick(item.section);
                  }
                }}
              >
                <item.icon />
                <span>{item.label}</span>
                {item.hasSubmenu && (
                  openMenus[item.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                )}
              </MenuItem>
              
              {item.hasSubmenu && (
                <SubMenu isOpen={openMenus[item.id]}>
                  {item.submenu?.map(subItem => (
                    <SubMenuItem
                      key={subItem.id}
                      active={activeSection === subItem.section}
                      onClick={() => handleNavItemClick(subItem.section)}
                    >
                      {subItem.label}
                    </SubMenuItem>
                  ))}
                </SubMenu>
              )}
            </div>
          ))}
        </MenuSection>

        <UserSection>
          <UserButton isOpen={userDropdownOpen} onClick={toggleUserDropdown}>
            <div className="avatar">
              <User size={20} />
            </div>
            <div className="info">
              <div className="name">{userFullName}</div>
              <div className="role">OAB 1ª e 2ª Fase Anual</div>
            </div>
            <ChevronDown 
              size={16} 
              className="chevron"
              style={{ 
                transform: userDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' 
              }}
            />
          </UserButton>

          <UserDropdown isOpen={userDropdownOpen}>
            <DropdownItem onClick={() => handleUserAction('account')}>
              <UserCircle />
              <span>Minha Conta</span>
            </DropdownItem>
            <DropdownItem onClick={() => handleUserAction('terms')}>
              <FileText />
              <span>Termos de Uso</span>
            </DropdownItem>
            <DropdownItem onClick={() => handleUserAction('privacy')}>
              <Shield />
              <span>Política de Privacidade</span>
            </DropdownItem>
            <DropdownItem className="logout" onClick={() => handleUserAction('logout')}>
              <LogOut />
              <span>Sair</span>
            </DropdownItem>
          </UserDropdown>
        </UserSection>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
