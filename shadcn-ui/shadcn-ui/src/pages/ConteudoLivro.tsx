import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  BookOpen, 
  CheckCircle, 
  Circle, 
  Play, 
  RotateCcw, 
  FileText, 
  Video, 
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Award,
  X,
  ArrowLeft,
  Menu
} from 'lucide-react';
import { Card } from '../styles/GlobalStyles';

interface Module {
  id: string;
  title: string;
  activities: Activity[];
  completed: number;
  total: number;
}

interface Activity {
  id: string;
  title: string;
  type: 'content' | 'video' | 'quiz';
  completed: boolean;
  duration?: string;
}

interface ContentData {
  courseId: string;
  moduleId: string;
  lessonId: string;
}

interface ConteudoLivroProps {
  contentData?: ContentData | null;
  onBack?: () => void;
}

const ConteudoContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 24px;
  gap: 24px;

  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }

  @media (max-width: 768px) {
    padding: 12px;
    gap: 12px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  max-width: calc(100% - 374px);
  
  @media (max-width: 1024px) {
    max-width: 100%;
    order: 2;
  }

  @media (max-width: 768px) {
    order: 2;
  }
`;

const NavigationSidebar = styled.div<{ isOpen?: boolean }>`
  width: 350px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 24px;
  overflow-y: auto;
  height: fit-content;
  max-height: calc(100vh - 48px);
  
  @media (max-width: 1024px) {
    width: 100%;
    max-height: none;
    order: 1;
    padding: 20px;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${props => props.isOpen ? '0' : '-100%'};
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    z-index: 1000;
    transition: right 0.3s ease;
    border-radius: 0;
    border: none;
    order: 1;
    padding: 16px;
    padding-top: 60px;
  }
`;

const MobileOverlay = styled.div<{ isOpen?: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 16px;
    right: 16px;
    width: 48px;
    height: 48px;
    background: ${props => props.theme.colors.accent};
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    z-index: 1001;
    box-shadow: 0 4px 12px ${props => props.theme.colors.shadow};
    
    &:hover {
      background: ${props => props.theme.colors.accentSecondary};
    }
  }
`;

const SidebarCloseButton = styled.button`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    background: ${props => props.theme.colors.textSecondary}20;
    color: ${props => props.theme.colors.text};
    border: none;
    border-radius: 6px;
    cursor: pointer;
    
    &:hover {
      background: ${props => props.theme.colors.textSecondary}30;
    }
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  margin-bottom: 24px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: ${props => props.theme.colors.accent}10;
    border-color: ${props => props.theme.colors.accent};
    color: ${props => props.theme.colors.accent};
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;
    margin-bottom: 16px;
  }
`;

const ContentHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 28px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 8px;
    
    @media (max-width: 768px) {
      font-size: 24px;
      margin-bottom: 6px;
    }
  }
  
  .breadcrumb {
    font-size: 14px;
    color: ${props => props.theme.colors.textSecondary};
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    
    @media (max-width: 768px) {
      font-size: 12px;
      gap: 6px;
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const ContentBody = styled(Card)`
  padding: 32px;
  line-height: 1.8;
  font-size: 16px;
  
  h2 {
    color: ${props => props.theme.colors.accent};
    margin: 32px 0 16px 0;
    font-size: 24px;
    
    @media (max-width: 768px) {
      font-size: 20px;
      margin: 24px 0 12px 0;
    }
  }
  
  h3 {
    color: ${props => props.theme.colors.text};
    margin: 24px 0 12px 0;
    font-size: 20px;
    
    @media (max-width: 768px) {
      font-size: 18px;
      margin: 20px 0 10px 0;
    }
  }
  
  p {
    margin-bottom: 16px;
    text-align: justify;
    
    @media (max-width: 768px) {
      text-align: left;
      margin-bottom: 14px;
    }
  }
  
  ul, ol {
    margin: 16px 0;
    padding-left: 24px;
    
    @media (max-width: 768px) {
      margin: 14px 0;
      padding-left: 20px;
    }
  }
  
  li {
    margin-bottom: 8px;
    
    @media (max-width: 768px) {
      margin-bottom: 6px;
    }
  }
  
  .highlight {
    background: ${props => props.theme.colors.accent}20;
    padding: 16px;
    border-left: 4px solid ${props => props.theme.colors.accent};
    border-radius: 0 8px 8px 0;
    margin: 24px 0;
    
    @media (max-width: 768px) {
      padding: 12px;
      margin: 16px 0;
    }
  }

  @media (max-width: 768px) {
    padding: 20px;
    font-size: 15px;
    line-height: 1.6;
  }
`;

const SidebarHeader = styled.div`
  margin-bottom: 24px;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: 16px;
    
    @media (max-width: 768px) {
      font-size: 16px;
      margin-bottom: 12px;
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const ContentTypeSelector = styled.div`
  display: flex;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const TypeButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  
  ${props => props.active ? `
    background: ${props.theme.colors.accent};
    color: white;
  ` : `
    background: transparent;
    color: ${props.theme.colors.textSecondary};
    
    &:hover {
      color: ${props.theme.colors.text};
    }
  `}

  @media (max-width: 768px) {
    padding: 6px 8px;
    font-size: 11px;
    gap: 3px;
  }
`;

const ModuleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const ModuleCard = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const ModuleHeader = styled.div<{ expanded: boolean }>`
  padding: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.surface};
  }
  
  .module-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    
    @media (max-width: 768px) {
      gap: 8px;
    }
  }
  
  .module-title {
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    font-size: 14px;
    
    @media (max-width: 768px) {
      font-size: 13px;
    }
  }
  
  .module-progress {
    font-size: 12px;
    color: ${props => props.theme.colors.textSecondary};
    
    @media (max-width: 768px) {
      font-size: 11px;
    }
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const ActivityList = styled.div<{ expanded: boolean }>`
  max-height: ${props => props.expanded ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActivityItem = styled.div<{ active?: boolean; completed?: boolean }>`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  ${props => props.active ? `
    background: ${props.theme.colors.accent}15;
    border-left: 3px solid ${props.theme.colors.accent};
  ` : ''}
  
  &:hover {
    background: ${props => props.theme.colors.surface};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  .activity-icon {
    color: ${props => props.completed ? props.theme.colors.success : props.theme.colors.textSecondary};
  }
  
  .activity-info {
    flex: 1;
    
    .activity-title {
      font-size: 14px;
      font-weight: 500;
      color: ${props => props.theme.colors.text};
      margin-bottom: 2px;
      
      @media (max-width: 768px) {
        font-size: 13px;
      }
    }
    
    .activity-duration {
      font-size: 12px;
      color: ${props => props.theme.colors.textSecondary};
      
      @media (max-width: 768px) {
        font-size: 11px;
      }
    }
  }
  
  .activity-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    
    @media (max-width: 768px) {
      gap: 6px;
    }
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    gap: 8px;
  }
`;

const ActionButton = styled.button<{ variant?: 'complete' | 'study' | 'review' }>`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  ${props => {
    switch (props.variant) {
      case 'complete':
        return `
          background: ${props.theme.colors.success}20;
          color: ${props.theme.colors.success};
          
          &:hover {
            background: ${props.theme.colors.success}30;
          }
        `;
      case 'study':
        return `
          background: ${props.theme.colors.accent};
          color: white;
          
          &:hover {
            background: ${props.theme.colors.accentSecondary};
          }
        `;
      case 'review':
        return `
          background: ${props.theme.colors.warning}20;
          color: ${props.theme.colors.warning};
          
          &:hover {
            background: ${props.theme.colors.warning}30;
          }
        `;
      default:
        return `
          background: ${props.theme.colors.surface};
          color: ${props.theme.colors.text};
          border: 1px solid ${props.theme.colors.border};
          
          &:hover {
            background: ${props.theme.colors.border};
          }
        `;
    }
  }}

  @media (max-width: 768px) {
    padding: 5px 8px;
    font-size: 11px;
    gap: 3px;
  }
`;

const CongratulationsModal = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  max-width: 400px;
  width: 100%;
  margin: 20px;
  position: relative;
  
  .icon {
    color: ${props => props.theme.colors.success};
    margin-bottom: 16px;
  }
  
  h3 {
    color: ${props => props.theme.colors.text};
    margin-bottom: 8px;
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 24px;
  }

  @media (max-width: 768px) {
    padding: 24px;
    margin: 16px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const ConteudoLivro: React.FC<ConteudoLivroProps> = ({ contentData, onBack }) => {
  const [contentType, setContentType] = useState<'pdf' | 'video' | 'questions'>('pdf');
  const [expandedModules, setExpandedModules] = useState<string[]>(['pessoas']);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modules, setModules] = useState<Module[]>([
    {
      id: 'pessoas',
      title: 'Pessoas',
      completed: 1,
      total: 3,
      activities: [
        {
          id: 'pessoas-naturais',
          title: 'Pessoas naturais',
          type: 'content',
          completed: false,
          duration: '15 min'
        },
        {
          id: 'pessoas-juridicas',
          title: 'Pessoas jurídicas',
          type: 'content',
          completed: false,
          duration: '20 min'
        },
        {
          id: 'capacidade-civil',
          title: 'Capacidade civil',
          type: 'content',
          completed: true,
          duration: '18 min'
        }
      ]
    },
    {
      id: 'bens',
      title: 'Bens',
      completed: 0,
      total: 4,
      activities: [
        {
          id: 'classificacao-bens',
          title: 'Classificação dos bens',
          type: 'content',
          completed: false,
          duration: '25 min'
        },
        {
          id: 'bens-publicos',
          title: 'Bens públicos',
          type: 'content',
          completed: false,
          duration: '15 min'
        },
        {
          id: 'bens-particulares',
          title: 'Bens particulares',
          type: 'content',
          completed: false,
          duration: '12 min'
        },
        {
          id: 'patrimonio',
          title: 'Patrimônio',
          type: 'content',
          completed: false,
          duration: '20 min'
        }
      ]
    },
    {
      id: 'fatos-juridicos',
      title: 'Fatos Jurídicos',
      completed: 0,
      total: 3,
      activities: [
        {
          id: 'atos-juridicos',
          title: 'Atos jurídicos',
          type: 'content',
          completed: false,
          duration: '30 min'
        },
        {
          id: 'negocios-juridicos',
          title: 'Negócios jurídicos',
          type: 'content',
          completed: false,
          duration: '35 min'
        },
        {
          id: 'prescricao-decadencia',
          title: 'Prescrição e decadência',
          type: 'content',
          completed: false,
          duration: '28 min'
        }
      ]
    }
  ]);

  const [currentActivity] = useState('pessoas-naturais');

  // Função para fechar sidebar no mobile após qualquer ação
  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
    closeSidebarOnMobile();
  };

  const toggleActivityCompletion = (moduleId: string, activityId: string) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        const updatedActivities = module.activities.map(activity => {
          if (activity.id === activityId) {
            const wasCompleted = activity.completed;
            if (!wasCompleted) {
              setShowCongratulations(true);
            }
            return { ...activity, completed: !activity.completed };
          }
          return activity;
        });
        
        const completed = updatedActivities.filter(a => a.completed).length;
        return { ...module, activities: updatedActivities, completed };
      }
      return module;
    }));
    closeSidebarOnMobile();
  };

  const handleContentTypeChange = (type: 'pdf' | 'video' | 'questions') => {
    setContentType(type);
    closeSidebarOnMobile();
  };

  const handleStudyButtonClick = (moduleId: string, activityId: string) => {
    // Aqui você pode implementar a lógica para navegar para a atividade específica
    closeSidebarOnMobile();
  };

  const getActivityIcon = (activity: Activity) => {
    if (activity.completed) {
      return <CheckCircle size={16} className="activity-icon" />;
    }
    
    switch (activity.type) {
      case 'content':
        return <FileText size={16} className="activity-icon" />;
      case 'video':
        return <Video size={16} className="activity-icon" />;
      case 'quiz':
        return <HelpCircle size={16} className="activity-icon" />;
      default:
        return <Circle size={16} className="activity-icon" />;
    }
  };

  const renderContentTypeContent = () => {
    switch (contentType) {
      case 'video':
        return (
          <ContentBody>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Video size={48} style={{ color: '#666', marginBottom: '16px' }} />
              <h3>Vídeo: Pessoas Naturais</h3>
              <p>Conteúdo em vídeo sobre pessoas naturais será carregado aqui.</p>
            </div>
          </ContentBody>
        );
      case 'questions':
        return (
          <ContentBody>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <HelpCircle size={48} style={{ color: '#666', marginBottom: '16px' }} />
              <h3>Questões: Pessoas Naturais</h3>
              <p>Sistema de questões relacionadas ao tema pessoas naturais será carregado aqui.</p>
            </div>
          </ContentBody>
        );
      default:
        return (
          <ContentBody>
            <h2>Pessoas Naturais</h2>
            
            <p>
              As pessoas naturais são todos os seres humanos, desde o nascimento com vida até a morte. 
              O Código Civil brasileiro estabelece que a personalidade civil da pessoa começa do nascimento 
              com vida, mas a lei põe a salvo, desde a concepção, os direitos do nascituro.
            </p>

            <h3>Conceito e Características</h3>
            
            <p>
              A pessoa natural é o ser humano considerado como sujeito de direitos e deveres na ordem civil. 
              Toda pessoa natural possui personalidade jurídica, que é a aptidão genérica para adquirir 
              direitos e contrair obrigações.
            </p>

            <div className="highlight">
              <strong>Importante:</strong> A personalidade civil inicia-se com o nascimento com vida, 
              mas os direitos do nascituro são protegidos desde a concepção.
            </div>

            <h3>Capacidade Civil</h3>
            
            <p>A capacidade civil divide-se em:</p>
            
            <ul>
              <li><strong>Capacidade de direito (ou de gozo):</strong> É a aptidão para ser titular de direitos e deveres. Toda pessoa natural possui essa capacidade.</li>
              <li><strong>Capacidade de fato (ou de exercício):</strong> É a aptidão para exercer pessoalmente os atos da vida civil. Nem toda pessoa natural possui essa capacidade.</li>
            </ul>

            <h3>Incapacidade Civil</h3>
            
            <p>O Código Civil estabelece duas categorias de incapacidade:</p>
            
            <ol>
              <li><strong>Incapacidade absoluta:</strong> Menores de 16 anos</li>
              <li><strong>Incapacidade relativa:</strong> Maiores de 16 e menores de 18 anos, ébrios habituais, viciados em tóxicos, deficientes mentais com discernimento reduzido, excepcionais sem desenvolvimento mental completo, pródigos</li>
            </ol>

            <h3>Direitos da Personalidade</h3>
            
            <p>
              Os direitos da personalidade são direitos subjetivos que têm por objeto os bens e valores 
              essenciais da pessoa, no seu aspecto físico, moral e intelectual. São direitos:
            </p>
            
            <ul>
              <li>Intransmissíveis e irrenunciáveis</li>
              <li>Imprescritíveis</li>
              <li>Impenhoráveis</li>
              <li>Vitalícios</li>
              <li>Absolutos</li>
            </ul>

            <div className="highlight">
              <strong>Jurisprudência:</strong> O STJ entende que os direitos da personalidade são 
              oponíveis erga omnes e sua violação gera direito à indenização por danos morais.
            </div>
          </ContentBody>
        );
    }
  };

  return (
    <>
      <MobileOverlay isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      
      <MobileMenuButton onClick={() => setSidebarOpen(true)}>
        <Menu size={20} />
      </MobileMenuButton>

      <ConteudoContainer>
        <MainContent>
          {onBack && (
            <BackButton onClick={onBack}>
              <ArrowLeft size={16} />
              Voltar aos Cursos
            </BackButton>
          )}

          <ContentHeader>
            <div className="breadcrumb">
              <BookOpen size={16} />
              <span>Direito Civil</span>
              <span>•</span>
              <span>Pessoas</span>
              <span>•</span>
              <span>Pessoas naturais</span>
            </div>
            <h1>Pessoas naturais</h1>
          </ContentHeader>

          {renderContentTypeContent()}
        </MainContent>

        <NavigationSidebar isOpen={sidebarOpen}>
          <SidebarCloseButton onClick={() => setSidebarOpen(false)}>
            <X size={16} />
          </SidebarCloseButton>
          
          <SidebarHeader>
            <h3>Direito Civil</h3>
            <ContentTypeSelector>
              <TypeButton 
                active={contentType === 'pdf'} 
                onClick={() => handleContentTypeChange('pdf')}
              >
                <FileText size={14} />
                PDF
              </TypeButton>
              <TypeButton 
                active={contentType === 'video'} 
                onClick={() => handleContentTypeChange('video')}
              >
                <Video size={14} />
                Vídeos
              </TypeButton>
              <TypeButton 
                active={contentType === 'questions'} 
                onClick={() => handleContentTypeChange('questions')}
              >
                <HelpCircle size={14} />
                Questões
              </TypeButton>
            </ContentTypeSelector>
          </SidebarHeader>

          <ModuleList>
            {modules.map(module => (
              <ModuleCard key={module.id}>
                <ModuleHeader 
                  expanded={expandedModules.includes(module.id)}
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="module-info">
                    <BookOpen size={16} />
                    <div>
                      <div className="module-title">{module.title}</div>
                      <div className="module-progress">
                        {module.completed}/{module.total} atividades
                      </div>
                    </div>
                  </div>
                  {expandedModules.includes(module.id) ? 
                    <ChevronDown size={16} /> : 
                    <ChevronRight size={16} />
                  }
                </ModuleHeader>
                
                <ActivityList expanded={expandedModules.includes(module.id)}>
                  {module.activities.map(activity => (
                    <ActivityItem 
                      key={activity.id}
                      active={activity.id === currentActivity}
                      completed={activity.completed}
                    >
                      {getActivityIcon(activity)}
                      
                      <div className="activity-info">
                        <div className="activity-title">{activity.title}</div>
                        <div className="activity-duration">{activity.duration}</div>
                      </div>
                      
                      <div className="activity-actions">
                        <ActionButton
                          variant="complete"
                          onClick={() => toggleActivityCompletion(module.id, activity.id)}
                        >
                          {activity.completed ? <CheckCircle size={12} /> : <Circle size={12} />}
                        </ActionButton>
                        
                        <ActionButton
                          variant={activity.completed ? 'review' : 'study'}
                          onClick={() => handleStudyButtonClick(module.id, activity.id)}
                        >
                          {activity.completed ? (
                            <>
                              <RotateCcw size={12} />
                              Revisar
                            </>
                          ) : (
                            <>
                              <Play size={12} />
                              Estudar
                            </>
                          )}
                        </ActionButton>
                      </div>
                    </ActivityItem>
                  ))}
                </ActivityList>
              </ModuleCard>
            ))}
          </ModuleList>
        </NavigationSidebar>
      </ConteudoContainer>

      <CongratulationsModal show={showCongratulations}>
        <ModalContent>
          <CloseButton onClick={() => setShowCongratulations(false)}>
            <X size={20} />
          </CloseButton>
          
          <div className="icon">
            <Award size={48} />
          </div>
          
          <h3>Parabéns!</h3>
          <p>Você concluiu esta atividade com sucesso. Continue assim!</p>
          
          <ActionButton 
            variant="study"
            onClick={() => setShowCongratulations(false)}
          >
            Continuar estudando
          </ActionButton>
        </ModalContent>
      </CongratulationsModal>
    </>
  );
};

export default ConteudoLivro;