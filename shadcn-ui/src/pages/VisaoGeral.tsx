import React from 'react';
import styled from 'styled-components';
import { 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Brain, 
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Card, Button } from '../styles/GlobalStyles';

const DashboardContainer = styled.div`
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
  text-align: left;
  
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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const FeatureCard = styled.div`
  background: ${props => props.theme?.colors?.surface || 'white'};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px ${props => props.theme?.colors?.shadow || 'rgba(0, 0, 0, 0.1)'};
  border: 1px solid ${props => props.theme?.colors?.border || '#e5e7eb'};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px ${props => props.theme?.colors?.shadow || 'rgba(0, 0, 0, 0.15)'};
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    margin-bottom: 0.75rem;
  }
`;

const CardIcon = styled.div`
  background: ${props => props.theme?.colors?.accent ? `linear-gradient(135deg, ${props.theme.colors.accent} 0%, ${props.theme.colors.accentSecondary || props.theme.colors.accent} 100%)` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  border-radius: 8px;
  padding: 0.75rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    padding: 0.5rem;
    margin-right: 0.75rem;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme?.colors?.text || '#1f2937'};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const CardDescription = styled.p`
  color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.theme?.colors?.accent || '#667eea'};
  font-weight: 500;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }

  .action-text {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const VisaoGeral: React.FC = () => {
  const features = [
    {
      id: 'meus-cursos',
      title: 'Meus Cursos',
      description: 'Acesse seus cursos matriculados, acompanhe o progresso e continue seus estudos de onde parou.',
      icon: <BookOpen size={24} color="white" />,
      action: 'Acessar cursos'
    },
    {
      id: 'vade-mecum',
      title: 'Vade Mecum',
      description: 'Consulte leis, códigos e legislações atualizadas de forma rápida e organizada.',
      icon: <FileText size={24} color="white" />,
      action: 'Consultar legislação'
    },
    {
      id: 'sistema-questoes',
      title: 'Sistema de Questões',
      description: 'Pratique com questões de exames anteriores, simulados e acompanhe seu desempenho.',
      icon: <HelpCircle size={24} color="white" />,
      action: 'Praticar questões'
    },
    {
      id: 'mapas-mentais',
      title: 'Mapas Mentais',
      description: 'Visualize e organize conhecimentos através de mapas mentais interativos e didáticos.',
      icon: <Brain size={24} color="white" />,
      action: 'Ver mapas'
    },
    {
      id: 'plano-estudos',
      title: 'Plano de Estudos',
      description: 'Organize seus estudos com planos personalizados e cronogramas eficientes.',
      icon: <Calendar size={24} color="white" />,
      action: 'Ver planos'
    }
  ];

  return (
    <DashboardContainer>
      <Header>
        <h1>Visão Geral</h1>
        <p>Bem-vindo ao seu painel de estudos. Acesse rapidamente suas ferramentas de aprendizado.</p>
      </Header>

      <ContentWrapper>
        <CardsGrid>
          {features.map((feature) => (
            <FeatureCard key={feature.id}>
              <CardHeader>
                <CardIcon>
                  {feature.icon}
                </CardIcon>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              
              <CardDescription>
                {feature.description}
              </CardDescription>
              
              <CardFooter>
                <div className="action-text">
                  <span>{feature.action}</span>
                  <ChevronRight size={16} />
                </div>
              </CardFooter>
            </FeatureCard>
          ))}
        </CardsGrid>
      </ContentWrapper>
    </DashboardContainer>
  );
};

export default VisaoGeral;