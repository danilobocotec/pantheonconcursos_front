import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, Book } from 'lucide-react';

interface ConteudoItemProps {
  course: {
    id: string;
    nome: string;
  };
  module: {
    id: string;
    nome: string;
    itens?: any[];
  };
  item: {
    id: string;
    titulo: string;
    tipo: string;
    conteudo: string;
  };
  onBack: () => void;
  onNavigateToItem?: (itemId: string) => void;
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const Sidebar = styled.div<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? '350px' : '0'};
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  overflow-y: auto;
  transition: width 0.3s ease;

  @media (max-width: 1024px) {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
    box-shadow: ${props => props.isOpen ? '0 0 20px rgba(0,0,0,0.1)' : 'none'};
  }
`;

const SidebarContent = styled.div`
  padding: 24px;
`;

const SidebarHeader = styled.div`
  margin-bottom: 24px;

  h2 {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    font-size: 14px;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ModuleProgress = styled.div`
  margin-bottom: 16px;

  .label {
    font-size: 12px;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 8px;
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 6px;
  background: ${props => props.theme.colors.border};
  border-radius: 3px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background: ${props => props.theme.colors.success};
    transition: width 0.3s ease;
  }
`;

const ActivitiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ActivityItem = styled.div<{ isActive: boolean; completed: boolean }>`
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isActive ? `${props.theme.colors.accent}15` : 'transparent'};
  border: 1px solid ${props => props.isActive ? props.theme.colors.accent : props.theme.colors.border};

  &:hover {
    background: ${props => props.theme.colors.accent}10;
    border-color: ${props => props.theme.colors.accent};
  }

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;

    .icon {
      color: ${props => props.completed ? props.theme.colors.success : props.theme.colors.textSecondary};
      flex-shrink: 0;
    }

    .title {
      font-size: 14px;
      font-weight: ${props => props.isActive ? '600' : '500'};
      color: ${props => props.theme.colors.text};
      line-height: 1.3;
    }
  }
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  background: ${props => props.theme.colors.background};
`;

const ContentHeader = styled.div`
  position: sticky;
  top: 0;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 16px 24px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: transparent;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.accent};
    border-color: ${props => props.theme.colors.accent};
    color: white;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

const ToggleSidebarButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.accent};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.accent};
    border-color: ${props => props.theme.colors.accent};
    color: white;
  }

  @media (max-width: 1024px) {
    display: flex;
  }
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  min-width: 0;

  .separator {
    color: ${props => props.theme.colors.border};
  }

  .current {
    color: ${props => props.theme.colors.text};
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 768px) {
    font-size: 12px;

    .course, .module {
      display: none;
    }
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.accent};
    border-color: ${props => props.theme.colors.accent};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 13px;

    span {
      display: none;
    }
  }
`;

const ContentBody = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const ContentTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 24px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 16px;
  }
`;

const ContentHtml = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: ${props => props.theme.colors.text};

  p {
    margin-bottom: 1em;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }

  h1 { font-size: 2em; }
  h2 { font-size: 1.5em; }
  h3 { font-size: 1.25em; }

  ul, ol {
    margin-bottom: 1em;
    padding-left: 2em;
  }

  li {
    margin-bottom: 0.5em;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1.5em 0;
  }

  iframe {
    max-width: 100%;
    margin: 1.5em 0;
  }

  a {
    color: ${props => props.theme.colors.accent};
    text-decoration: underline;

    &:hover {
      color: ${props => props.theme.colors.accentSecondary};
    }
  }

  strong {
    font-weight: 700;
  }

  em {
    font-style: italic;
  }

  code {
    background: ${props => props.theme.colors.surface};
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  pre {
    background: ${props => props.theme.colors.surface};
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1.5em 0;

    code {
      background: none;
      padding: 0;
    }
  }

  blockquote {
    border-left: 4px solid ${props => props.theme.colors.accent};
    padding-left: 16px;
    margin: 1.5em 0;
    color: ${props => props.theme.colors.textSecondary};
    font-style: italic;
  }

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const Overlay = styled.div<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;

  @media (min-width: 1025px) {
    display: none;
  }
`;

const ConteudoItem: React.FC<ConteudoItemProps> = ({
  course,
  module,
  item,
  onBack,
  onNavigateToItem
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (module.itens) {
      const index = module.itens.findIndex(i => i.id === item.id);
      setCurrentIndex(index);
    }
  }, [item.id, module.itens]);

  const handlePrevious = () => {
    if (module.itens && currentIndex > 0 && onNavigateToItem) {
      onNavigateToItem(module.itens[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (module.itens && currentIndex < module.itens.length - 1 && onNavigateToItem) {
      onNavigateToItem(module.itens[currentIndex + 1].id);
    }
  };

  const calculateProgress = () => {
    if (!module.itens || module.itens.length === 0) return 0;
    const completed = module.itens.filter(i => i.completed).length;
    return Math.round((completed / module.itens.length) * 100);
  };

  return (
    <Container>
      <Overlay isVisible={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      <Sidebar isOpen={sidebarOpen}>
        <SidebarContent>
          <SidebarHeader>
            <h2>
              <Book size={20} />
              {module.nome}
            </h2>
            <p>{course.nome}</p>
          </SidebarHeader>

          <ModuleProgress>
            <div className="label">
              {module.itens?.filter(i => i.completed).length || 0}/{module.itens?.length || 0} atividades concluídas
            </div>
            <ProgressBar progress={calculateProgress()} />
          </ModuleProgress>

          <ActivitiesList>
            {module.itens?.map((activityItem, index) => (
              <ActivityItem
                key={activityItem.id}
                isActive={activityItem.id === item.id}
                completed={activityItem.completed}
                onClick={() => {
                  if (onNavigateToItem) {
                    onNavigateToItem(activityItem.id);
                  }
                  if (window.innerWidth <= 1024) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <div className="header">
                  <div className="icon">
                    {activityItem.completed ? <CheckCircle size={16} /> : <span>{index + 1}</span>}
                  </div>
                  <div className="title">{activityItem.titulo}</div>
                </div>
              </ActivityItem>
            ))}
          </ActivitiesList>
        </SidebarContent>
      </Sidebar>

      <MainContent>
        <ContentHeader>
          <HeaderLeft>
            <BackButton onClick={onBack}>
              <ArrowLeft size={16} />
              <span>Voltar aos Cursos</span>
            </BackButton>

            <ToggleSidebarButton onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Book size={18} />
            </ToggleSidebarButton>

            <Breadcrumb>
              <span className="course">{course.nome}</span>
              <ChevronRight size={14} className="separator" />
              <span className="module">{module.nome}</span>
              <ChevronRight size={14} className="separator" />
              <span className="current">{item.titulo}</span>
            </Breadcrumb>
          </HeaderLeft>

          <NavigationButtons>
            <NavButton
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={16} />
              <span>Anterior</span>
            </NavButton>
            <NavButton
              onClick={handleNext}
              disabled={!module.itens || currentIndex === module.itens.length - 1}
            >
              <span>Próximo</span>
              <ChevronRight size={16} />
            </NavButton>
          </NavigationButtons>
        </ContentHeader>

        <ContentBody>
          <ContentTitle>{item.titulo}</ContentTitle>
          <ContentHtml dangerouslySetInnerHTML={{ __html: item.conteudo }} />
        </ContentBody>
      </MainContent>
    </Container>
  );
};

export default ConteudoItem;
