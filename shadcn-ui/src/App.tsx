import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle, lightTheme, darkTheme } from './styles/GlobalStyles';
import Sidebar from './components/Layout/Sidebar';
import MeusCursos from './pages/MeusCursos';
import SistemaQuestoes from './pages/SistemaQuestoes';
import VadeMecum from './pages/VadeMecum';
import MapasMentais from './pages/MapasMentais';
import Settings from './pages/Settings';
import ConteudoLivro from './pages/ConteudoLivro';
import PlanoEstudos from './pages/PlanoEstudos';
import { Sun, Moon } from 'lucide-react';

type AppProps = {
  initialSection?: string;
  onNavigateHome?: () => void;
};

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const MainContent = styled.main<{ isMobile: boolean }>`
  flex: 1;
  margin-left: ${props => props.isMobile ? '0' : '280px'};
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  transition: margin-left 0.3s ease;
`;

const ThemeToggle = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: ${props => props.theme.colors.accent};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px ${props => props.theme.colors.shadow};
  transition: all 0.2s ease;
  z-index: 1000;

  &:hover {
    background: ${props => props.theme.colors.accentSecondary};
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const BackButton = styled.button`
  position: fixed;
  top: 20px;
  right: 90px;
  padding: 10px 18px;
  border-radius: 9999px;
  border: none;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px ${props => props.theme.colors.shadow};
  transition: all 0.2s ease;
  z-index: 1000;

  &:hover {
    background: ${props => props.theme.colors.accent};
    color: white;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    right: 16px;
    top: 80px;
    padding: 8px 14px;
  }
`;

// Updated Dashboard Container to match other pages pattern
const DashboardContainer = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 32px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const PageDescription = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 320px);
  gap: 32px;
  max-width: 1100px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 320px);
    gap: 24px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    width: 100%;
  }
`;

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 4px 16px ${props => props.theme.colors.shadow};
    border-color: ${props => props.theme.colors.accent};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const CardIcon = styled.div`
  font-size: 32px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 12px;
  }
`;

const CardTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 8px;
  }
`;

const CardDescription = styled.p`
  font-size: 14px;
  margin-bottom: 0;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const App: React.FC<AppProps> = ({ initialSection = 'dashboard', onNavigateHome }) => {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [contentData, setContentData] = useState<{
    courseId: string;
    moduleId: string;
    lessonId: string;
  } | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleContentLoad = (courseId: string, moduleId: string, lessonId: string) => {
    setContentData({ courseId, moduleId, lessonId });
    setActiveSection('content');
  };

  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  const handleFeatureClick = (section: string) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'plano-estudos':
        return <PlanoEstudos />;
      case 'courses':
        return <MeusCursos onContentLoad={handleContentLoad} />;
      case 'questions-objective':
      case 'questions-discursive':
      case 'questions-exams':
      case 'questions-simulations':
      case 'questions-performance':
        return <SistemaQuestoes />;
      case 'vademecum':
        return <VadeMecum />;
      case 'mindmaps':
        return <MapasMentais />;
      case 'settings':
        return <Settings />;
      case 'content':
        return <ConteudoLivro contentData={contentData} onBack={() => setActiveSection('courses')} />;
      default:
        return (
          <DashboardContainer>
            <PageHeader>
              <PageTitle>Visão Geral</PageTitle>
              <PageDescription>
                Sua plataforma completa de estudos para a OAB. Acesse cursos, 
                pratique com questões, consulte o Vade Mecum e muito mais.
              </PageDescription>
            </PageHeader>
            
            <CardsContainer>
              <CardsGrid>
                <Card onClick={() => handleFeatureClick('plano-estudos')}>
                  <CardIcon>📅</CardIcon>
                  <CardTitle>Plano de Estudos</CardTitle>
                  <CardDescription>Acesse cronogramas personalizados para sua preparação</CardDescription>
                </Card>
                <Card onClick={() => handleFeatureClick('courses')}>
                  <CardIcon>📚</CardIcon>
                  <CardTitle>Meus Cursos</CardTitle>
                  <CardDescription>Acesse conteúdos da 1ª e 2ª fase da OAB com acompanhamento de progresso</CardDescription>
                </Card>
                <Card onClick={() => handleFeatureClick('questions-objective')}>
                  <CardIcon>❓</CardIcon>
                  <CardTitle>Sistema de Questões</CardTitle>
                  <CardDescription>Pratique com milhares de questões objetivas e discursivas comentadas</CardDescription>
                </Card>
                <Card onClick={() => handleFeatureClick('vademecum')}>
                  <CardIcon>⚖️</CardIcon>
                  <CardTitle>Vade Mecum</CardTitle>
                  <CardDescription>Consulte leis, códigos e jurisprudência de forma organizada</CardDescription>
                </Card>
                <Card onClick={() => handleFeatureClick('mindmaps')}>
                  <CardIcon>🧠</CardIcon>
                  <CardTitle>Mapas Mentais</CardTitle>
                  <CardDescription>Visualize conceitos importantes através de mapas mentais interativos</CardDescription>
                </Card>
              </CardsGrid>
            </CardsContainer>
          </DashboardContainer>
        );
    }
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <AppContainer>
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          isDarkMode={isDarkMode}
          onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        />
        <MainContent isMobile={isMobile}>
          {renderContent()}
        </MainContent>

        {onNavigateHome && (
          <BackButton onClick={onNavigateHome}>
            Voltar ao site
          </BackButton>
        )}
        
        <ThemeToggle onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </ThemeToggle>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
