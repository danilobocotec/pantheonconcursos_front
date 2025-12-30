import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronDown, ChevronRight, Play, CheckCircle, Clock, Award, BookOpen, RotateCcw } from 'lucide-react';
import { Card, Button, media } from '../styles/GlobalStyles';
import { authenticatedGet, clearAuthToken } from '../lib/auth';

interface Course {
  id: string;
  nome: string;
  categoria_id?: string;
  modulos?: Module[];
  progress: number;
  isExpanded?: boolean;
}

interface Module {
  id: string;
  nome: string;
  itens?: Item[];
  progress: number;
  isExpanded?: boolean;
}

interface Item {
  id: string;
  titulo: string;
  tipo: string;
  conteudo: string;
  completed: boolean;
}

interface MeusCursosProps {
  onContentLoad?: (courseId: string, moduleId: string, itemId: string) => void;
  onNavigateToContent?: (course: Course, module: Module, item: Item) => void;
  onNavigateToLogin?: () => void;
}

const CoursesContainer = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const Header = styled.div`
  margin-bottom: 32px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 8px;

    @media (max-width: 768px) {
      font-size: 24px;
    }

    @media (max-width: 480px) {
      font-size: 22px;
    }
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 16px;

    @media (max-width: 768px) {
      font-size: 14px;
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const PhaseTabsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    gap: 4px;
    margin-bottom: 20px;
  }
`;

const PhaseTab = styled.button<{ active: boolean }>`
  padding: 16px 24px;
  border: none;
  background: ${props => props.active ? props.theme.colors.accent : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: ${props => props.active ? 'none' : `1px solid ${props.theme.colors.border}`};
  flex: 1;
  text-align: center;

  &:hover {
    background: ${props => props.active ? props.theme.colors.accentSecondary : `${props.theme.colors.accentSecondary}15`};
    color: ${props => props.active ? 'white' : props.theme.colors.accentSecondary};
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 13px;
  }
`;

const CourseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const CourseCard = styled(Card)<{ isExpanded: boolean }>`
  position: relative;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.accentSecondary};
  }

  @media (max-width: 768px) {
    margin-bottom: 4px;
  }
`;

const CourseHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  background: ${props => props.theme.colors.surface};
  transition: background 0.2s ease;

  &:hover {
    background: ${props => `${props.theme.colors.accentSecondary}15`};
  }

  .icon {
    margin-right: 12px;
    color: ${props => props.theme.colors.accent};
    flex-shrink: 0;

    @media (max-width: 480px) {
      margin-right: 8px;
    }
  }

  .info {
    flex: 1;
    min-width: 0;

    .name {
      font-weight: 600;
      color: ${props => props.theme.colors.text};
      margin-bottom: 4px;
      line-height: 1.3;

      @media (max-width: 768px) {
        font-size: 14px;
      }

      @media (max-width: 480px) {
        font-size: 13px;
        margin-bottom: 2px;
      }
    }

    .meta {
      font-size: 12px;
      color: ${props => props.theme.colors.textSecondary};
      display: flex;
      gap: 16px;
      flex-wrap: wrap;

      @media (max-width: 768px) {
        gap: 12px;
        font-size: 11px;
      }

      @media (max-width: 480px) {
        gap: 8px;
        font-size: 10px;
      }
    }
  }

  .progress {
    margin-right: 12px;
    min-width: 60px;
    text-align: right;
    flex-shrink: 0;

    .percentage {
      font-size: 14px;
      font-weight: 600;
      color: ${props => props.theme.colors.accent};

      @media (max-width: 768px) {
        font-size: 13px;
      }

      @media (max-width: 480px) {
        font-size: 12px;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
  }
`;

const CourseContent = styled.div<{ isExpanded: boolean }>`
  max-height: ${props => props.isExpanded ? '2000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  background: ${props => props.theme.colors.background};
`;

const ModuleList = styled.div`
  margin-top: 16px;

  @media (max-width: 768px) {
    margin-top: 12px;
  }

  @media (max-width: 480px) {
    margin-top: 8px;
  }
`;

const ModuleItem = styled.div<{ isExpanded: boolean }>`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.accentSecondary};
  }

  @media (max-width: 768px) {
    margin-bottom: 6px;
  }

  @media (max-width: 480px) {
    margin-bottom: 4px;
  }
`;

const ModuleHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  background: ${props => props.theme.colors.surface};
  transition: background 0.2s ease;

  &:hover {
    background: ${props => `${props.theme.colors.accentSecondary}15`};
  }

  .icon {
    margin-right: 12px;
    color: ${props => props.theme.colors.accent};
    flex-shrink: 0;

    @media (max-width: 480px) {
      margin-right: 8px;
    }
  }

  .info {
    flex: 1;
    min-width: 0;

    .name {
      font-weight: 600;
      color: ${props => props.theme.colors.text};
      margin-bottom: 4px;
      line-height: 1.3;

      @media (max-width: 768px) {
        font-size: 14px;
      }

      @media (max-width: 480px) {
        font-size: 13px;
        margin-bottom: 2px;
      }
    }

    .meta {
      font-size: 12px;
      color: ${props => props.theme.colors.textSecondary};
      display: flex;
      gap: 16px;
      flex-wrap: wrap;

      @media (max-width: 768px) {
        gap: 12px;
        font-size: 11px;
      }

      @media (max-width: 480px) {
        gap: 8px;
        font-size: 10px;
      }
    }
  }

  .progress {
    margin-right: 12px;
    min-width: 60px;
    text-align: right;
    flex-shrink: 0;

    .percentage {
      font-size: 14px;
      font-weight: 600;
      color: ${props => props.theme.colors.accent};

      @media (max-width: 768px) {
        font-size: 13px;
      }

      @media (max-width: 480px) {
        font-size: 12px;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
  }
`;

const ItemList = styled.div<{ isExpanded: boolean }>`
  max-height: ${props => props.isExpanded ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  background: ${props => props.theme.colors.background};
`;

const ItemRow = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px 12px 44px;
  border-top: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => `${props.theme.colors.accentSecondary}10`};
  }

  .status-icon {
    margin-right: 12px;
    color: ${props => props.completed ? props.theme.colors.success : props.theme.colors.textSecondary};
    cursor: pointer;
    flex-shrink: 0;

    &:hover {
      color: ${props => props.theme.colors.accentSecondary};
    }

    @media (max-width: 480px) {
      margin-right: 8px;
    }
  }

  .content {
    flex: 1;
    min-width: 0;
    margin-right: 12px;

    .title {
      font-weight: 500;
      color: ${props => props.theme.colors.text};
      margin-bottom: 2px;
      line-height: 1.3;

      @media (max-width: 768px) {
        font-size: 14px;
      }

      @media (max-width: 480px) {
        font-size: 13px;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 10px 12px 10px 36px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px 8px 28px;
  }
`;

const ActionButton = styled.button<{ completed?: boolean }>`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  white-space: nowrap;

  ${props => {
    if (props.completed) {
      return `
        background: ${props.theme.colors.warning}20;
        color: ${props.theme.colors.warning};

        &:hover {
          background: ${props.theme.colors.warning}30;
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.accent};
        color: white;

        &:hover {
          background: ${props.theme.colors.accentSecondary};
        }
      `;
    }
  }}

  @media (max-width: 768px) {
    padding: 5px 10px;
    font-size: 11px;
    gap: 3px;
  }

  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 10px;
    gap: 2px;
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background: ${props => props.theme.colors.success};
    transition: width 0.3s ease;
  }

  @media (max-width: 768px) {
    height: 6px;
  }

  @media (max-width: 480px) {
    height: 4px;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.colors.error};
  background: ${props => props.theme.colors.error}10;
  border-radius: 8px;
`;

const MeusCursos: React.FC<MeusCursosProps> = ({ onContentLoad, onNavigateToContent, onNavigateToLogin }) => {
  const [activePhase, setActivePhase] = useState<'1fase' | '2fase'>('1fase');
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados usando a função autenticada
      const [categoriesData, coursesData, modulesData, itemsData] = await Promise.all([
        authenticatedGet('/cursos/categorias'),
        authenticatedGet('/cursos'),
        authenticatedGet('/meus-cursos/modulos'),
        authenticatedGet('/meus-cursos/itens'),
      ]);

      setCategories(categoriesData);
      setModules(modulesData);
      setItems(itemsData);

      // Organizar dados por categoria (1ª e 2ª fase)
      const organized = organizeCoursesByCategory(coursesData, categoriesData, modulesData, itemsData);
      setCourses(organized);

    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);

      if (err.message === 'Usuário não autenticado' || err.message === 'Sessão expirada') {
        setError('Sessão expirada. Redirecionando para login...');
        clearAuthToken();
        setTimeout(() => {
          if (onNavigateToLogin) {
            onNavigateToLogin();
          } else {
            window.location.href = '/';
          }
        }, 2000);
      } else {
        setError('Erro ao carregar cursos. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const organizeCoursesByCategory = (coursesData: any[], categoriesData: any[], modulesData: any[], itemsData: any[]) => {
    return coursesData.map(course => {
      // Buscar módulos do curso
      const courseModules = modulesData.filter(m =>
        course.modulos?.includes(m.id)
      );

      // Para cada módulo, buscar seus itens
      const modulesWithItems = courseModules.map(module => {
        const moduleItems = itemsData.filter(item =>
          item.modulo_id === module.id
        ).map(item => ({
          ...item,
          completed: false // TODO: buscar progresso do usuário
        }));

        return {
          ...module,
          itens: moduleItems,
          progress: calculateModuleProgress(moduleItems),
          isExpanded: false
        };
      });

      return {
        id: course.id,
        nome: course.nome,
        categoria_id: course.categoria_id,
        modulos: modulesWithItems,
        progress: calculateCourseProgress(modulesWithItems),
        isExpanded: false
      };
    });
  };

  const calculateModuleProgress = (items: any[]) => {
    if (!items || items.length === 0) return 0;
    const completed = items.filter(i => i.completed).length;
    return Math.round((completed / items.length) * 100);
  };

  const calculateCourseProgress = (modules: any[]) => {
    if (!modules || modules.length === 0) return 0;
    const totalProgress = modules.reduce((sum, m) => sum + m.progress, 0);
    return Math.round(totalProgress / modules.length);
  };

  const toggleCourse = (courseId: string) => {
    setCourses(prev => prev.map(course =>
      course.id === courseId
        ? { ...course, isExpanded: !course.isExpanded }
        : course
    ));
  };

  const toggleModule = (courseId: string, moduleId: string) => {
    setCourses(prev => prev.map(course =>
      course.id === courseId
        ? {
            ...course,
            modulos: course.modulos?.map(module =>
              module.id === moduleId
                ? { ...module, isExpanded: !module.isExpanded }
                : module
            )
          }
        : course
    ));
  };

  const handleItemClick = (course: Course, module: Module, item: Item) => {
    if (onNavigateToContent) {
      onNavigateToContent(course, module, item);
    } else if (onContentLoad) {
      onContentLoad(course.id, module.id, item.id);
    }
  };

  const getFilteredCourses = () => {
    const fase1Category = categories.find(c => c.nome.toLowerCase().includes('1') || c.nome.toLowerCase().includes('primeira'));
    const fase2Category = categories.find(c => c.nome.toLowerCase().includes('2') || c.nome.toLowerCase().includes('segunda'));

    if (activePhase === '1fase' && fase1Category) {
      return courses.filter(c => c.categoria_id === fase1Category.id);
    } else if (activePhase === '2fase' && fase2Category) {
      return courses.filter(c => c.categoria_id === fase2Category.id);
    }

    return courses;
  };

  const renderCourse = (course: Course) => (
    <CourseCard key={course.id} isExpanded={course.isExpanded || false}>
      <CourseHeader onClick={() => toggleCourse(course.id)}>
        <div className="icon">
          {course.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
        <div className="info">
          <div className="name">{course.nome}</div>
          <div className="meta">
            <span>{course.modulos?.length || 0} módulos</span>
            <span>{course.modulos?.reduce((acc, m) => acc + (m.itens?.filter(i => i.completed).length || 0), 0)} concluídas</span>
          </div>
        </div>
        <div className="progress">
          <div className="percentage">{course.progress}%</div>
        </div>
      </CourseHeader>

      <CourseContent isExpanded={course.isExpanded || false}>
        <ProgressBar progress={course.progress} />

        <ModuleList>
          {course.modulos?.map(module => (
            <ModuleItem key={module.id} isExpanded={module.isExpanded || false}>
              <ModuleHeader onClick={() => toggleModule(course.id, module.id)}>
                <div className="icon">
                  {module.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
                <div className="info">
                  <div className="name">{module.nome}</div>
                  <div className="meta">
                    <span>{module.itens?.length || 0} atividades</span>
                    <span>{module.itens?.filter(i => i.completed).length || 0} concluídas</span>
                  </div>
                </div>
                <div className="progress">
                  <div className="percentage">{module.progress}%</div>
                </div>
              </ModuleHeader>

              <ItemList isExpanded={module.isExpanded || false}>
                {module.itens?.map((item: Item) => (
                  <ItemRow key={item.id} completed={item.completed}>
                    <div className="status-icon">
                      {item.completed ? <CheckCircle size={16} /> : <Clock size={16} />}
                    </div>
                    <div className="content">
                      <div className="title">{item.titulo}</div>
                    </div>
                    <ActionButton
                      completed={item.completed}
                      onClick={() => handleItemClick(course, module, item)}
                    >
                      {item.completed ? <RotateCcw size={12} /> : <BookOpen size={12} />}
                      {item.completed ? 'Revisar' : 'Estudar'}
                    </ActionButton>
                  </ItemRow>
                ))}
              </ItemList>
            </ModuleItem>
          ))}
        </ModuleList>
      </CourseContent>
    </CourseCard>
  );

  if (loading) {
    return (
      <CoursesContainer>
        <Header>
          <h1>Meus Cursos</h1>
          <p>Acompanhe seu progresso e continue seus estudos</p>
        </Header>
        <LoadingMessage>Carregando cursos...</LoadingMessage>
      </CoursesContainer>
    );
  }

  if (error) {
    return (
      <CoursesContainer>
        <Header>
          <h1>Meus Cursos</h1>
          <p>Acompanhe seu progresso e continue seus estudos</p>
        </Header>
        <ErrorMessage>{error}</ErrorMessage>
      </CoursesContainer>
    );
  }

  const filteredCourses = getFilteredCourses();

  return (
    <CoursesContainer>
      <Header>
        <h1>Meus Cursos</h1>
        <p>Acompanhe seu progresso e continue seus estudos</p>
      </Header>

      <PhaseTabsContainer>
        <PhaseTab
          active={activePhase === '1fase'}
          onClick={() => setActivePhase('1fase')}
        >
          OAB 1ª Fase
        </PhaseTab>
        <PhaseTab
          active={activePhase === '2fase'}
          onClick={() => setActivePhase('2fase')}
        >
          OAB 2ª Fase
        </PhaseTab>
      </PhaseTabsContainer>

      <CourseList>
        {filteredCourses.length === 0 ? (
          <LoadingMessage>Nenhum curso disponível nesta categoria</LoadingMessage>
        ) : (
          filteredCourses.map(course => renderCourse(course))
        )}
      </CourseList>
    </CoursesContainer>
  );
};

export default MeusCursos;
