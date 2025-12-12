import React from 'react';
import styled from 'styled-components';
import { Download, Calendar, Clock, BookOpen } from 'lucide-react';

const DashboardContainer = styled.div`
  padding: 24px;
  background: ${props => props.theme?.colors?.background || '#f9fafb'};
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
    color: ${props => props.theme?.colors?.text || '#1f2937'};
    margin-bottom: 8px;

    @media (max-width: 768px) {
      font-size: 24px;
    }

    @media (max-width: 480px) {
      font-size: 22px;
    }
  }
  
  p {
    color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
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

const PlansGrid = styled.div`
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

const PlanCard = styled.div`
  background: ${props => props.theme?.colors?.surface || 'white'};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px ${props => props.theme?.colors?.shadow || 'rgba(0, 0, 0, 0.1)'};
  border: 1px solid ${props => props.theme?.colors?.border || '#e5e7eb'};
  transition: all 0.3s ease;

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

const PlanHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    margin-bottom: 0.75rem;
  }
`;

const PlanIcon = styled.div`
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

const PlanTitle = styled.h3`
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

const PlanDuration = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
  margin-bottom: 1rem;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
  }
`;

const PlanDescription = styled.p`
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

const DownloadButton = styled.button`
  background: ${props => props.theme?.colors?.accent ? `linear-gradient(135deg, ${props.theme.colors.accent} 0%, ${props.theme.colors.accentSecondary || props.theme.colors.accent} 100%)` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px ${props => props.theme?.colors?.accent ? `${props.theme.colors.accent}66` : 'rgba(102, 126, 234, 0.4)'};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }
`;

const studyPlans = [
  {
    id: 1,
    title: 'Plano de Estudos OAB 30 dias',
    duration: '30 dias',
    description: 'Plano intensivo para revisão focada nas disciplinas essenciais do exame da OAB. Ideal para quem já possui conhecimento consolidado.',
    filename: 'plano-estudos-oab-30-dias.pdf'
  },
  {
    id: 2,
    title: 'Plano de Estudos OAB 45 dias',
    duration: '45 dias',
    description: 'Cronograma equilibrado que combina estudo teórico e resolução de questões, com foco nas matérias de maior incidência.',
    filename: 'plano-estudos-oab-45-dias.pdf'
  },
  {
    id: 3,
    title: 'Plano de Estudos OAB 60 dias',
    duration: '60 dias',
    description: 'Plano completo com tempo adequado para absorção do conteúdo, revisões programadas e simulados regulares.',
    filename: 'plano-estudos-oab-60-dias.pdf'
  },
  {
    id: 4,
    title: 'Plano de Estudos OAB 90 dias',
    duration: '90 dias',
    description: 'Cronograma detalhado para estudo aprofundado de todas as disciplinas, com múltiplas revisões e prática extensiva.',
    filename: 'plano-estudos-oab-90-dias.pdf'
  },
  {
    id: 5,
    title: 'Plano de Estudos OAB 120 dias',
    duration: '120 dias',
    description: 'Plano extenso e completo, ideal para iniciantes ou quem deseja uma preparação mais sólida e gradual.',
    filename: 'plano-estudos-oab-120-dias.pdf'
  }
];

const PlanoEstudos: React.FC = () => {
  const handleDownload = (filename: string, planTitle: string) => {
    // Simulate PDF download - in a real application, this would download from a server
    const link = document.createElement('a');
    link.href = `/assets/study-plans/${filename}`;
    link.download = filename;
    link.click();
    
    // Show a message to the user
    alert(`Download iniciado: ${planTitle}`);
  };

  return (
    <DashboardContainer>
      <Header>
        <h1>Planos de Estudos OAB</h1>
        <p>
          Escolha o plano de estudos que melhor se adapta ao seu cronograma e nível de preparação. 
          Todos os planos foram desenvolvidos por especialistas para maximizar seu desempenho no exame da OAB.
        </p>
      </Header>

      <ContentWrapper>
        <PlansGrid>
          {studyPlans.map((plan) => (
            <PlanCard key={plan.id}>
              <PlanHeader>
                <PlanIcon>
                  <BookOpen size={24} color="white" />
                </PlanIcon>
                <PlanTitle>{plan.title}</PlanTitle>
              </PlanHeader>
              
              <PlanDuration>
                <Clock size={16} style={{ marginRight: '0.5rem' }} />
                Duração: {plan.duration}
              </PlanDuration>
              
              <PlanDescription>
                {plan.description}
              </PlanDescription>
              
              <DownloadButton onClick={() => handleDownload(plan.filename, plan.title)}>
                <Download size={18} />
                Baixar PDF
              </DownloadButton>
            </PlanCard>
          ))}
        </PlansGrid>
      </ContentWrapper>
    </DashboardContainer>
  );
};

export default PlanoEstudos;