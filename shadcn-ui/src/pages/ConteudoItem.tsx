import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, Book, Check, ChevronDown } from 'lucide-react';
import { authenticatedGet, authenticatedPost, authenticatedPut } from '../lib/auth';

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
    completed?: boolean;
    audio_url?: string;
    audioUrl?: string;
  };
  onBack: () => void;
  onNavigateToItem?: (itemId: string) => void;
  onItemComplete?: (itemId: string, completed: boolean) => void;
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: ${props => props.theme.colors.background};
  flex-direction: row-reverse;
`;

const Sidebar = styled.div<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? '350px' : '0'};
  background: ${props => props.theme.colors.surface};
  border-left: 1px solid ${props => props.theme.colors.border};
  overflow-y: auto;
  transition: width 0.3s ease;

  @media (max-width: 1024px) {
    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
    box-shadow: ${props => props.isOpen ? '0 0 20px rgba(0,0,0,0.1)' : 'none'};
  }
`;

const SidebarContent = styled.div`
  padding: 24px;
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

const SidebarTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;

  h2 {
    font-size: 16px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }
`;

const SidebarPillButton = styled.button`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: #7b1b1b;
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  box-shadow: 0 6px 14px rgba(123, 27, 27, 0.25);
  margin-bottom: 16px;
`;

const ModuleNavCard = styled.div`
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: 12px 0;
`;

const ModuleNavHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  background: transparent;
  border: none;
  padding: 8px 0;
  cursor: pointer;
  text-align: left;

  .module-info {
    display: flex;
    gap: 10px;
  }

  .module-title {
    font-size: 12px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    text-transform: uppercase;
    line-height: 1.3;
  }

  .module-meta {
    font-size: 12px;
    color: ${props => props.theme.colors.textSecondary};
    margin-top: 4px;
  }
`;

const ModuleNavList = styled.div<{ expanded: boolean }>`
  display: ${props => (props.expanded ? 'flex' : 'none')};
  flex-direction: column;
  gap: 10px;
  padding: 8px 0 0 0;
`;

const ModuleNavItem = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: ${props => (props.isActive ? '#f6eded' : 'transparent')};
  border: 1px solid ${props => (props.isActive ? '#e6caca' : 'transparent')};
  cursor: pointer;

  .nav-title {
    flex: 1;
    font-size: 13px;
    color: ${props => props.theme.colors.text};
    line-height: 1.3;
  }

  .nav-actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
`;

const StatusBadge = styled.span<{ completed: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 22px;
  border-radius: 6px;
  background: ${props => (props.completed ? '#e2f6ea' : '#f0f0f0')};
  color: ${props => (props.completed ? '#1f9d55' : '#999')};
  font-size: 12px;
`;

const NavActionButton = styled.button<{ completed: boolean }>`
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  background: ${props => (props.completed ? '#ffe8cc' : '#7b1b1b')};
  color: ${props => (props.completed ? '#d97706' : '#fff')};
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

const ContentTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }
`;

const ContentTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1.2;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const CompleteButton = styled.button<{ completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  border: 2px solid ${props => props.completed ? props.theme.colors.success : props.theme.colors.accent};
  background: ${props => props.completed ? props.theme.colors.success : props.theme.colors.accent};
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.completed ? props.theme.colors.success : props.theme.colors.accent}40;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 13px;
  }
`;

const ContentHtml = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: ${props => props.theme.colors.text};

  .audiobook-player {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 12px 16px;
    background: #f2f2f2;
    border-radius: 9999px;
    border: 1px solid ${props => props.theme.colors.border};
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  }

  .audiobook-player audio {
    width: 260px;
    height: 32px;
  }

  @media (max-width: 768px) {
    .audiobook-player {
      padding: 10px 12px;
    }

    .audiobook-player audio {
      width: 100%;
    }
  }

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
    padding: 16px 20px;
    margin: 1.5em 0;
    color: ${props => props.theme.colors.textSecondary};
    font-style: italic;
    background: #f6eded;
    border-radius: 12px;
  }

  mark {
    background: rgba(123, 27, 27, 0.45);
    color: inherit;
    padding: 2px 4px;
    border-radius: 6px;
  }

  span[style*="background"] {
    background-color: rgba(123, 27, 27, 0.45) !important;
    padding: 2px 4px;
    border-radius: 6px;
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
  onNavigateToItem,
  onItemComplete
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(item.completed || false);
  const [moduleNavOpen, setModuleNavOpen] = useState(true);

  const getAudioSource = () => {
    const directUrl = item.audio_url || item.audioUrl;
    if (directUrl) return directUrl;

    const conteudo = item.conteudo || '';
    const urlMatch = conteudo.match(
      /(https?:\/\/[^\s"'<>]+\.(?:mp3|mp4|wav|ogg)(?:\?[^\s"'<>]+)?)/i
    );
    if (urlMatch?.[1]) return urlMatch[1];

    const trimmed = conteudo.trim();
    if (!trimmed || trimmed.includes('<')) return '';
    if (/^(https?:)?\/\//i.test(trimmed)) return trimmed;
    if (/\.(mp3|mp4|wav|ogg)$/i.test(trimmed)) return trimmed;

    return '';
  };

  const audioSrc = getAudioSource();
  const contentIsHtml = item.conteudo?.includes('<');
  const contentHtml = contentIsHtml ? item.conteudo : '';
  const contentText =
    !contentIsHtml && item.conteudo && item.tipo !== 'audio'
      ? item.conteudo
      : '';
  const contentHtmlWithAudiobook =
    contentHtml && audioSrc
      ? contentHtml.replace(
          /(Audiobook|Ouvir áudio|Ouvir audio)/gi,
          `<span class="audiobook-player"><audio controls controlsList="nodownload noplaybackrate" src="${audioSrc}"></audio></span>`
        )
      : contentHtml;

  useEffect(() => {
    console.log('ConteudoItem - Dados recebidos:', {
      course: { id: course.id, nome: course.nome },
      module: { id: module.id, nome: module.nome, itensCount: module.itens?.length || 0 },
      item: { id: item.id, titulo: item.titulo, completed: item.completed },
      moduleItens: module.itens
    });

    setIsCompleted(item.completed || false);

    if (module.itens) {
      const index = module.itens.findIndex(i => i.id === item.id);
      setCurrentIndex(index);
    }
  }, [item.id, module.itens, course.id, course.nome, module.id, module.nome, item.titulo, item.completed]);

  const handleToggleComplete = () => {
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const updateProgress = async (completed: boolean) => {
      const progressUrl = `/meus-cursos/itens/${item.id}/progresso`;
      const payload = {
        concluido: completed,
        data_conclusao: completed ? new Date().toISOString() : null
      };

      if (completed) {
        try {
          await authenticatedPost(progressUrl, payload);
          return;
        } catch (error) {
          await authenticatedPut(progressUrl, payload);
          return;
        }
      }

      await authenticatedPut(progressUrl, payload);
    };

    const fetchItemProgressStatus = async (expectedCompleted: boolean): Promise<boolean | null> => {
      const maxAttempts = expectedCompleted ? 3 : 1;

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const progressData = await authenticatedGet('/meus-cursos/itens/progresso');
        if (!Array.isArray(progressData)) {
          return null;
        }

        const itemId = String(item.id);
        const matched = progressData.find((progress: any) => {
          const progressItemId = String(
            progress?.course_item_id ??
            progress?.item_id ??
            progress?.itemId ??
            progress?.item?.id ??
            progress?.id ??
            ''
          );
          return progressItemId === itemId;
        });

        if (!matched) {
          if (expectedCompleted && attempt < maxAttempts - 1) {
            await sleep(300);
            continue;
          }
          return false;
        }

        if (typeof matched?.concluido === 'boolean') return matched.concluido;
        if (typeof matched?.completed === 'boolean') return matched.completed;
        return null;
      }

      return null;
    };

    const updateLocalProgress = (completed: boolean) => {
      const completedItems = JSON.parse(localStorage.getItem('pantheon:completed-items') || '[]');
      const itemId = String(item.id);
      if (completed) {
        if (!completedItems.includes(itemId)) {
          completedItems.push(itemId);
        }
      } else {
        const index = completedItems.indexOf(itemId);
        if (index > -1) {
          completedItems.splice(index, 1);
        }
      }
      localStorage.setItem('pantheon:completed-items', JSON.stringify(completedItems));
    };

    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);

    if (onItemComplete) {
      onItemComplete(item.id, newCompleted);
    }

    updateProgress(newCompleted)
      .then(async () => {
        const serverCompleted = await fetchItemProgressStatus(newCompleted);
        const finalCompleted = typeof serverCompleted === 'boolean' ? serverCompleted : newCompleted;
        setIsCompleted(finalCompleted);
        if (onItemComplete) {
          onItemComplete(item.id, finalCompleted);
        }
        updateLocalProgress(finalCompleted);
      })
      .catch((error) => {
        console.error('Erro ao atualizar progresso do item:', error);
        const previousCompleted = !newCompleted;
        setIsCompleted(previousCompleted);
        if (onItemComplete) {
          onItemComplete(item.id, previousCompleted);
        }
      });
  };

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
          <SidebarTop>
            <h2>{course.nome}</h2>
          </SidebarTop>

          <SidebarPillButton type="button">
            <Book size={14} />
            Aulas
          </SidebarPillButton>

          <ModuleNavCard>
            <ModuleNavHeader type="button" onClick={() => setModuleNavOpen(!moduleNavOpen)}>
              <div className="module-info">
                <Book size={16} />
                <div>
                  <div className="module-title">{module.nome}</div>
                  <div className="module-meta">
                    {module.itens?.filter(i => i.completed).length || 0}/{module.itens?.length || 0} atividades
                  </div>
                </div>
              </div>
              <ChevronDown size={16} />
            </ModuleNavHeader>
            <ProgressBar progress={calculateProgress()} />
            <ModuleNavList expanded={moduleNavOpen}>
              {module.itens?.map((activityItem) => (
                <ModuleNavItem
                  key={activityItem.id}
                  isActive={activityItem.id === item.id}
                  onClick={() => {
                    if (onNavigateToItem) {
                      onNavigateToItem(activityItem.id);
                    }
                    if (window.innerWidth <= 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <Book size={16} />
                  <div className="nav-title">{activityItem.titulo}</div>
                  <div className="nav-actions">
                    <StatusBadge completed={activityItem.completed}>
                      {activityItem.completed ? <CheckCircle size={14} /> : null}
                    </StatusBadge>
                    <NavActionButton
                      type="button"
                      completed={activityItem.completed}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (onNavigateToItem) {
                          onNavigateToItem(activityItem.id);
                        }
                        if (window.innerWidth <= 1024) {
                          setSidebarOpen(false);
                        }
                      }}
                    >
                      {activityItem.completed ? 'Revisar' : 'Estudar'}
                    </NavActionButton>
                  </div>
                </ModuleNavItem>
              ))}
            </ModuleNavList>
          </ModuleNavCard>
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
          <ContentTitleRow>
            <ContentTitle>{item.titulo}</ContentTitle>
            <CompleteButton
              completed={isCompleted}
              onClick={handleToggleComplete}
            >
              {isCompleted ? (
                <>
                  <CheckCircle size={18} />
                  <span>Concluído</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>Marcar como concluído</span>
                </>
              )}
            </CompleteButton>
          </ContentTitleRow>
          {contentHtmlWithAudiobook && (
            <ContentHtml dangerouslySetInnerHTML={{ __html: contentHtmlWithAudiobook }} />
          )}
          {contentText && <ContentHtml>{contentText}</ContentHtml>}
        </ContentBody>
      </MainContent>
    </Container>
  );
};

export default ConteudoItem;
