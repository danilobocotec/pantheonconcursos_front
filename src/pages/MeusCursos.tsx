import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronDown, ChevronRight, Play, CheckCircle, Clock, Award, BookOpen, RotateCcw } from 'lucide-react';
import { Card, Button, media } from '../styles/GlobalStyles';

interface Course {
  id: string;
  name: string;
  modules: Module[];
  progress: number;
  isExpanded?: boolean;
}

interface Module {
  id: string;
  name: string;
  lessons: Lesson[];
  progress: number;
  isExpanded?: boolean;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'text' | 'audio';
}

interface MeusCursosProps {
  onContentLoad?: (courseId: string, moduleId: string, lessonId: string) => void;
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

const LessonList = styled.div<{ isExpanded: boolean }>`
  max-height: ${props => props.isExpanded ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  background: ${props => props.theme.colors.background};
`;

const LessonItem = styled.div<{ completed: boolean }>`
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
    
    .duration {
      font-size: 12px;
      color: ${props => props.theme.colors.textSecondary};

      @media (max-width: 768px) {
        font-size: 11px;
      }

      @media (max-width: 480px) {
        font-size: 10px;
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

const ActionButton = styled.button<{ completed?: boolean; phase?: string }>`
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

const AchievementBanner = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.success}, ${props => props.theme.colors.accent});
  color: white;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideIn 0.5s ease;

  .icon {
    font-size: 24px;
    flex-shrink: 0;

    @media (max-width: 480px) {
      font-size: 20px;
    }
  }

  .content {
    flex: 1;
    
    .title {
      font-weight: 600;
      margin-bottom: 4px;

      @media (max-width: 768px) {
        font-size: 14px;
      }

      @media (max-width: 480px) {
        font-size: 13px;
        margin-bottom: 2px;
      }
    }
    
    .description {
      font-size: 14px;
      opacity: 0.9;

      @media (max-width: 768px) {
        font-size: 13px;
      }

      @media (max-width: 480px) {
        font-size: 12px;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 12px;
    gap: 8px;
    margin: 12px 0;
  }

  @media (max-width: 480px) {
    padding: 10px;
    gap: 6px;
    margin: 8px 0;
  }
`;

const MeusCursos: React.FC<MeusCursosProps> = ({ onContentLoad }) => {
  const [activePhase, setActivePhase] = useState<'1fase' | '2fase'>('1fase');
  const [courses, setCourses] = useState<{ [phase: string]: Course[] }>({
    '1fase': [
      {
        id: 'civil',
        name: 'Direito Civil',
        progress: 65,
        isExpanded: false,
        modules: [
          {
            id: 'lindb',
            name: 'Lei de Introdução às Normas do Direito Brasileiro',
            progress: 100,
            isExpanded: false,
            lessons: [
              { id: 'lindb-1', title: 'Lei de Introdução às Normas do Direito Brasileiro', duration: '45 min', completed: true, type: 'text' }
            ]
          },
          {
            id: 'pessoas',
            name: 'Pessoas',
            progress: 67,
            isExpanded: false,
            lessons: [
              { id: 'pessoas-1', title: 'Pessoas naturais', duration: '38 min', completed: true, type: 'text' },
              { id: 'pessoas-2', title: 'Capacidade', duration: '42 min', completed: true, type: 'text' },
              { id: 'pessoas-3', title: 'Emancipação', duration: '35 min', completed: false, type: 'text' }
            ]
          }
        ]
      },
      {
        id: 'constitucional',
        name: 'Direito Constitucional',
        progress: 45,
        isExpanded: false,
        modules: [
          {
            id: 'teoria',
            name: 'Teoria das Constituições',
            progress: 50,
            isExpanded: false,
            lessons: [
              { id: 'teoria-1', title: 'Poder Constituinte', duration: '50 min', completed: true, type: 'text' },
              { id: 'teoria-2', title: 'Emenda à Constituição', duration: '45 min', completed: false, type: 'text' }
            ]
          }
        ]
      },
      {
        id: 'penal',
        name: 'Direito Penal',
        progress: 30,
        isExpanded: false,
        modules: [
          {
            id: 'teoria-crime',
            name: 'Teoria Geral do Crime',
            progress: 30,
            isExpanded: false,
            lessons: [
              { id: 'crime-1', title: 'Conceito de Crime', duration: '55 min', completed: true, type: 'text' },
              { id: 'crime-2', title: 'Elementos do Crime', duration: '48 min', completed: false, type: 'text' },
              { id: 'crime-3', title: 'Classificação dos Crimes', duration: '52 min', completed: false, type: 'text' }
            ]
          }
        ]
      }
    ],
    '2fase': [
      {
        id: 'trabalho-pratico',
        name: 'Curso 2ª Fase OAB – Prática de Direito do Trabalho',
        progress: 33,
        isExpanded: false,
        modules: [
          {
            id: 'pratica-trabalho',
            name: 'Aulas Práticas',
            progress: 33,
            isExpanded: false,
            lessons: [
              { id: 'trabalho-1', title: 'Aula 01 - Introdução ao Direito do Trabalho', duration: '60 min', completed: true, type: 'video' },
              { id: 'trabalho-2', title: 'Aula 02 - Contrato de Trabalho', duration: '65 min', completed: false, type: 'video' },
              { id: 'trabalho-3', title: 'Aula 03 - Rescisão Contratual', duration: '70 min', completed: false, type: 'video' }
            ]
          }
        ]
      },
      {
        id: 'civil-pratico',
        name: 'Curso 2ª Fase OAB – Prática de Direito Civil',
        progress: 25,
        isExpanded: false,
        modules: [
          {
            id: 'pratica-civil',
            name: 'Aulas Práticas',
            progress: 25,
            isExpanded: false,
            lessons: [
              { id: 'civil-1', title: 'Aula 01 - Petição Inicial Cível', duration: '75 min', completed: true, type: 'video' },
              { id: 'civil-2', title: 'Aula 02 - Contestação', duration: '68 min', completed: false, type: 'video' },
              { id: 'civil-3', title: 'Aula 03 - Recursos Cíveis', duration: '72 min', completed: false, type: 'video' },
              { id: 'civil-4', title: 'Aula 04 - Execução', duration: '80 min', completed: false, type: 'video' }
            ]
          }
        ]
      }
    ]
  });

  const [showAchievement, setShowAchievement] = useState(false);

  const toggleCourse = (courseId: string) => {
    setCourses(prev => ({
      ...prev,
      [activePhase]: prev[activePhase].map(course => 
        course.id === courseId 
          ? { ...course, isExpanded: !course.isExpanded }
          : course
      )
    }));
  };

  const toggleModule = (courseId: string, moduleId: string) => {
    setCourses(prev => ({
      ...prev,
      [activePhase]: prev[activePhase].map(course => 
        course.id === courseId 
          ? {
              ...course,
              modules: course.modules.map(module =>
                module.id === moduleId
                  ? { ...module, isExpanded: !module.isExpanded }
                  : module
              )
            }
          : course
      )
    }));
  };

  const toggleLessonCompletion = (courseId: string, moduleId: string, lessonId: string) => {
    setCourses(prev => {
      const newCourses = { ...prev };
      const course = newCourses[activePhase].find(c => c.id === courseId);
      if (course) {
        const module = course.modules.find(m => m.id === moduleId);
        if (module) {
          const lesson = module.lessons.find(l => l.id === lessonId);
          if (lesson) {
            const wasCompleted = lesson.completed;
            lesson.completed = !lesson.completed;
            
            if (!wasCompleted && lesson.completed) {
              setShowAchievement(true);
              setTimeout(() => setShowAchievement(false), 5000);
            }
          }
        }
      }
      return newCourses;
    });
  };

  const handleLessonClick = (courseId: string, moduleId: string, lessonId: string) => {
    // Chamar callback para carregar conteúdo
    if (onContentLoad) {
      onContentLoad(courseId, moduleId, lessonId);
    }
  };

  const getButtonText = (lesson: Lesson, phase: string) => {
    if (lesson.completed) {
      return 'Revisar';
    }
    
    if (phase === '1fase') {
      return 'Estudar';
    } else {
      return 'Assistir';
    }
  };

  const getButtonIcon = (lesson: Lesson, phase: string) => {
    if (lesson.completed) {
      return <RotateCcw size={12} />;
    }
    
    if (phase === '1fase') {
      return <BookOpen size={12} />;
    } else {
      return <Play size={12} />;
    }
  };

  const renderCourse = (course: Course) => (
    <CourseCard key={course.id} isExpanded={course.isExpanded || false}>
      <CourseHeader onClick={() => toggleCourse(course.id)}>
        <div className="icon">
          {course.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
        <div className="info">
          <div className="name">{course.name}</div>
          <div className="meta">
            <span>{course.modules.length} assuntos</span>
            <span>{course.modules.reduce((acc, m) => acc + m.lessons.filter(l => l.completed).length, 0)} concluídas</span>
          </div>
        </div>
        <div className="progress">
          <div className="percentage">{course.progress}%</div>
        </div>
      </CourseHeader>
      
      <CourseContent isExpanded={course.isExpanded || false}>
        <ProgressBar progress={course.progress} />
        
        <ModuleList>
          {course.modules.map(module => (
            <ModuleItem key={module.id} isExpanded={module.isExpanded || false}>
              <ModuleHeader onClick={() => toggleModule(course.id, module.id)}>
                <div className="icon">
                  {module.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
                <div className="info">
                  <div className="name">{module.name}</div>
                  <div className="meta">
                    <span>{module.lessons.length} aulas</span>
                    <span>{module.lessons.filter(l => l.completed).length} concluídas</span>
                  </div>
                </div>
                <div className="progress">
                  <div className="percentage">{module.progress}%</div>
                </div>
              </ModuleHeader>
              
              <LessonList isExpanded={module.isExpanded || false}>
                {module.lessons.map(lesson => (
                  <LessonItem key={lesson.id} completed={lesson.completed}>
                    <div 
                      className="status-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLessonCompletion(course.id, module.id, lesson.id);
                      }}
                      title={lesson.completed ? 'Marcar como não concluída' : 'Marcar como concluída'}
                    >
                      {lesson.completed ? <CheckCircle size={16} /> : <Clock size={16} />}
                    </div>
                    <div className="content">
                      <div className="title">{lesson.title}</div>
                      <div className="duration">{lesson.duration}</div>
                    </div>
                    <ActionButton 
                      completed={lesson.completed}
                      phase={activePhase}
                      onClick={() => handleLessonClick(course.id, module.id, lesson.id)}
                    >
                      {getButtonIcon(lesson, activePhase)}
                      {getButtonText(lesson, activePhase)}
                    </ActionButton>
                  </LessonItem>
                ))}
              </LessonList>
            </ModuleItem>
          ))}
        </ModuleList>
      </CourseContent>
    </CourseCard>
  );

  return (
    <CoursesContainer>
      <Header>
        <h1>Meus Cursos</h1>
        <p>Acompanhe seu progresso e continue seus estudos</p>
      </Header>

      {showAchievement && (
        <AchievementBanner>
          <Award className="icon" />
          <div className="content">
            <div className="title">Parabéns! 🎉</div>
            <div className="description">Você concluiu mais uma aula. Continue assim!</div>
          </div>
        </AchievementBanner>
      )}

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
        {courses[activePhase].map(course => renderCourse(course))}
      </CourseList>
    </CoursesContainer>
  );
};

export default MeusCursos;