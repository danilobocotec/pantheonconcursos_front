import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Grid, 
  List, 
  Search, 
  Filter, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Download,
  BookOpen,
  Scale,
  Users,
  Building,
  Briefcase,
  FileText,
  Gavel,
  Shield
} from 'lucide-react';
import { Card, Button, media } from '../styles/GlobalStyles';

interface MindMap {
  id: string;
  title: string;
  discipline: string;
  theme: string;
  description: string;
  thumbnail: string;
  createdAt: string;
}

const MapasMentaisContainer = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;

  ${media.mobile} {
    padding: 16px;
    padding-top: 60px;
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 28px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 8px;

    ${media.mobile} {
      font-size: 24px;
    }
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 16px;

    ${media.mobile} {
      font-size: 14px;
    }
  }
`;

const SimulationFilters = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: ${props => props.theme.colors.surface};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};

  ${media.mobile} {
    flex-direction: column;
    padding: 16px;
    gap: 12px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 150px;

  ${media.mobile} {
    min-width: unset;
  }

  label {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme.colors.textSecondary};
    text-transform: uppercase;
  }

  select {
    padding: 8px 12px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 6px;
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover {
      border-color: ${props => props.theme.colors.accentSecondary};
    }

    &:focus {
      border-color: ${props => props.theme.colors.accentSecondary};
      outline: none;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const ControlsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  ${media.mobile} {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  max-width: 400px;

  ${media.mobile} {
    max-width: none;
  }
`;

const SearchField = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 14px;

  &:focus {
    border-color: ${props => props.theme.colors.accent};
    outline: none;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 4px;
  background: ${props => props.theme.colors.surface};
  border-radius: 6px;
  padding: 4px;
  border: 1px solid ${props => props.theme.colors.border};

  ${media.mobile} {
    align-self: center;
  }
`;

const ViewButton = styled.button<{ active: boolean }>`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background: ${props => props.active ? props.theme.colors.accent : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.accentSecondary : `${props.theme.colors.accentSecondary}15`};
    color: ${props => props.active ? 'white' : props.theme.colors.accentSecondary};
  }
`;

const ResultsInfo = styled.div`
  margin-bottom: 16px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;

  ${media.mobile} {
    text-align: center;
  }
`;

const MindMapsGrid = styled.div<{ viewMode: 'grid' | 'list' }>`
  display: ${props => props.viewMode === 'grid' ? 'grid' : 'flex'};
  ${props => props.viewMode === 'grid' && `
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  `}
  ${props => props.viewMode === 'list' && `
    flex-direction: column;
    gap: 12px;
  `}
  margin-bottom: 32px;

  ${media.mobile} {
    ${props => props.viewMode === 'grid' && `
      grid-template-columns: 1fr;
      gap: 16px;
    `}
  }
`;

const MindMapCard = styled(Card)<{ viewMode: 'grid' | 'list' }>`
  ${props => props.viewMode === 'grid' ? `
    display: flex;
    flex-direction: column;
    height: 240px;
  ` : `
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px;
    height: auto;
  `}
  
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.colors.shadow};
    border-color: ${props => props.theme.colors.accentSecondary};
  }

  ${media.mobile} {
    ${props => props.viewMode === 'list' && `
      flex-direction: column;
      align-items: stretch;
      padding: 16px;
    `}
  }
`;

const MindMapThumbnail = styled.div<{ viewMode: 'grid' | 'list' }>`
  ${props => props.viewMode === 'grid' ? `
    width: 100%;
    height: 160px;
  ` : `
    width: 120px;
    height: 80px;
    margin-right: 16px;
    flex-shrink: 0;
  `}
  
  background: linear-gradient(135deg, ${props => props.theme.colors.accent}, ${props => props.theme.colors.accentSecondary});
  border-radius: ${props => props.viewMode === 'grid' ? '8px 8px 0 0' : '6px'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${props => props.viewMode === 'grid' ? '24px' : '20px'};

  ${media.mobile} {
    ${props => props.viewMode === 'list' && `
      width: 100%;
      height: 120px;
      margin-right: 0;
      margin-bottom: 12px;
      border-radius: 6px;
    `}
  }
`;

const MindMapContent = styled.div<{ viewMode: 'grid' | 'list' }>`
  ${props => props.viewMode === 'grid' ? `
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
  ` : `
    flex: 1;
  `}
`;

const MindMapTitle = styled.h3<{ viewMode: 'grid' | 'list' }>`
  font-size: ${props => props.viewMode === 'grid' ? '16px' : '18px'};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  line-height: 1.4;

  ${media.mobile} {
    font-size: 16px;
  }
`;

const MindMapMeta = styled.div<{ viewMode: 'grid' | 'list' }>`
  display: flex;
  ${props => props.viewMode === 'grid' ? `
    flex-direction: column;
    gap: 4px;
  ` : `
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  `}
  
  .discipline {
    font-size: 12px;
    font-weight: bold;
    color: #FFFFFF;
    background: ${props => `${props.theme.colors.accent}15`};
    padding: 4px 8px;
    border-radius: 4px;
    width: fit-content;
  }
  
  .theme {
    font-size: 12px;
    color: ${props => props.theme.colors.textSecondary};
  }
  
  .description {
    font-size: 14px;
    color: ${props => props.theme.colors.textSecondary};
    margin: 8px 0;
    ${props => props.viewMode === 'grid' && `
      flex: 1;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    `}
  }

  ${media.mobile} {
    ${props => props.viewMode === 'list' && `
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    `}
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
  padding: 20px;

  ${media.mobile} {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }
`;

const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.disabled ? props.theme.colors.surface : props.theme.colors.background};
  color: ${props => props.disabled ? props.theme.colors.textSecondary : props.theme.colors.text};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.accent};
    color: white;
    border-color: ${props => props.theme.colors.accent};
  }

  ${media.mobile} {
    padding: 10px 16px;
    font-size: 14px;
  }
`;

const PaginationInfo = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;

  ${media.mobile} {
    text-align: center;
    order: -1;
  }
`;

// Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;

  ${media.mobile} {
    padding: 10px;
  }
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  max-width: 90vw;
  max-height: 90vh;
  width: 800px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  ${media.mobile} {
    width: 100%;
    max-width: none;
    max-height: 95vh;
    border-radius: 8px;
  }
`;

const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;

  ${media.mobile} {
    padding: 16px;
    gap: 12px;
  }
`;

const ModalHeaderInfo = styled.div`
  flex: 1;
  
  h2 {
    font-size: 20px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: 8px;
    line-height: 1.3;

    ${media.mobile} {
      font-size: 18px;
    }
  }
  
  .meta {
    display: flex;
    gap: 12px;
    margin-bottom: 8px;
    flex-wrap: wrap;
    
    .discipline {
      font-size: 12px;
      font-weight: bold;
      color: #FFFFFF;
      background: ${props => `${props.theme.colors.accent}15`};
      padding: 4px 8px;
      border-radius: 4px;
    }
    
    .theme {
      font-size: 12px;
      color: ${props => props.theme.colors.textSecondary};
      background: ${props => props.theme.colors.surface};
      padding: 4px 8px;
      border-radius: 4px;
    }
  }
  
  .description {
    font-size: 14px;
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.4;
  }
`;

const CloseButton = styled.button`
  padding: 8px;
  border: none;
  border-radius: 6px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: ${props => props.theme.colors.error};
    color: white;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const ModalBody = styled.div`
  flex: 1;
  padding: 20px;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  ${media.mobile} {
    padding: 16px;
  }
`;

const MindMapImage = styled.div`
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, ${props => props.theme.colors.accent}, ${props => props.theme.colors.accentSecondary});
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  position: relative;
  
  &::after {
    content: 'Mapa Mental Completo';
    position: absolute;
    bottom: 20px;
    left: 20px;
    font-size: 16px;
    font-weight: 500;
    opacity: 0.9;
  }

  ${media.mobile} {
    height: 250px;
    font-size: 32px;

    &::after {
      font-size: 14px;
      bottom: 15px;
      left: 15px;
    }
  }
`;

const ModalFooter = styled.div`
  padding: 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  ${media.mobile} {
    padding: 16px;
    justify-content: center;
  }
`;

const DownloadButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 16px;
    height: 16px;
  }

  ${media.mobile} {
    width: 100%;
    justify-content: center;
  }
`;

const MapasMentais: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [simulationFilters, setSimulationFilters] = useState<{ [key: string]: string }>({
    discipline: '',
    subject: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMindMap, setSelectedMindMap] = useState<MindMap | null>(null);
  const itemsPerPage = 12;

  const disciplines = [
    { id: 'civil', name: 'Direito Civil', icon: FileText },
    { id: 'constitucional', name: 'Direito Constitucional', icon: Scale },
    { id: 'administrativo', name: 'Direito Administrativo', icon: Building },
    { id: 'penal', name: 'Direito Penal', icon: Gavel },
    { id: 'trabalho', name: 'Direito do Trabalho', icon: Briefcase },
    { id: 'empresarial', name: 'Direito Empresarial', icon: Building },
    { id: 'tributario', name: 'Direito Tributário', icon: FileText },
    { id: 'oab', name: 'Estatuto da OAB', icon: Shield }
  ];

  const subjectsByDiscipline: { [key: string]: string[] } = {
    'civil': ['Pessoas', 'Bens', 'Contratos', 'Responsabilidade Civil'],
    'constitucional': ['Direitos Fundamentais', 'Organização do Estado', 'Controle de Constitucionalidade'],
    'administrativo': ['Concurso Público', 'Cargos Públicos', 'Empresas Públicas', 'Licitações'],
    'penal': ['Teoria Geral do Crime', 'Penas', 'Crimes Específicos'],
    'trabalho': ['Contrato de Trabalho', 'Rescisão', 'FGTS', 'Previdência Social'],
    'empresarial': ['Sociedades', 'Falência', 'Títulos de Crédito'],
    'tributario': ['Sistema Tributário', 'Impostos', 'Processo Tributário'],
    'oab': ['Código de Ética', 'Estatuto', 'Regulamento Geral']
  };

  // Mock data
  const mockMindMaps: MindMap[] = [
    {
      id: '1',
      title: 'Concurso Público - Princípios e Regras',
      discipline: 'Direito Administrativo',
      theme: 'Concurso Público',
      description: 'Mapa mental completo sobre os princípios constitucionais e legais que regem os concursos públicos no Brasil.',
      thumbnail: '🏛️',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Contratos - Elementos e Classificação',
      discipline: 'Direito Civil',
      theme: 'Contratos',
      description: 'Visão geral dos contratos no direito civil, incluindo elementos essenciais, classificações e vícios.',
      thumbnail: '📄',
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      title: 'Direitos Fundamentais na CF/88',
      discipline: 'Direito Constitucional',
      theme: 'Direitos Fundamentais',
      description: 'Mapeamento completo dos direitos e garantias fundamentais previstos na Constituição Federal.',
      thumbnail: '⚖️',
      createdAt: '2024-01-08'
    },
    {
      id: '4',
      title: 'Teoria Geral do Crime',
      discipline: 'Direito Penal',
      theme: 'Teoria Geral do Crime',
      description: 'Conceitos fundamentais sobre crime, seus elementos e classificações no direito penal brasileiro.',
      thumbnail: '🔒',
      createdAt: '2024-01-05'
    },
    {
      id: '5',
      title: 'Licitações - Modalidades e Procedimentos',
      discipline: 'Direito Administrativo',
      theme: 'Licitações',
      description: 'Guia completo sobre as modalidades de licitação e seus procedimentos conforme a Lei 8.666/93.',
      thumbnail: '📋',
      createdAt: '2024-01-03'
    },
    {
      id: '6',
      title: 'Contrato de Trabalho - Características',
      discipline: 'Direito do Trabalho',
      theme: 'Contrato de Trabalho',
      description: 'Elementos caracterizadores do contrato de trabalho e suas principais modalidades.',
      thumbnail: '👔',
      createdAt: '2024-01-01'
    }
  ];

  const filteredMindMaps = mockMindMaps.filter(mindMap => {
    const matchesSearch = mindMap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mindMap.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDiscipline = !simulationFilters.discipline || 
                             mindMap.discipline === disciplines.find(d => d.id === simulationFilters.discipline)?.name;
    
    const matchesTheme = !simulationFilters.subject || 
                        mindMap.theme === simulationFilters.subject;
    
    return matchesSearch && matchesDiscipline && matchesTheme;
  });

  const totalPages = Math.ceil(filteredMindMaps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMindMaps = filteredMindMaps.slice(startIndex, startIndex + itemsPerPage);

  const handleDisciplineChange = (discipline: string) => {
    setSimulationFilters(prev => ({
      ...prev,
      discipline,
      subject: '' // Reset subject when discipline changes
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSimulationFilters({ discipline: '', subject: '' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getDisciplineIcon = (disciplineName: string) => {
    const discipline = disciplines.find(d => d.name === disciplineName);
    return discipline ? discipline.icon : BookOpen;
  };

  const handleViewMindMap = (mindMap: MindMap) => {
    setSelectedMindMap(mindMap);
  };

  const handleCloseMindMap = () => {
    setSelectedMindMap(null);
  };

  const handleDownload = (mindMap: MindMap) => {
    // Simulate download
    console.log(`Downloading mind map: ${mindMap.title}`);
  };

  return (
    <MapasMentaisContainer>
      <Header>
        <h1>Mapas Mentais</h1>
        <p>Visualize conceitos importantes através de mapas mentais interativos</p>
      </Header>

      <SimulationFilters>
        <FilterGroup>
          <label>Disciplina</label>
          <select 
            value={simulationFilters.discipline} 
            onChange={(e) => handleDisciplineChange(e.target.value)}
          >
            <option value="">Todas</option>
            {disciplines.map(discipline => (
              <option key={discipline.id} value={discipline.id}>{discipline.name}</option>
            ))}
          </select>
        </FilterGroup>

        <FilterGroup>
          <label>Assunto</label>
          <select 
            value={simulationFilters.subject} 
            onChange={(e) => setSimulationFilters(prev => ({...prev, subject: e.target.value}))}
            disabled={!simulationFilters.discipline}
          >
            <option value="">Todos</option>
            {simulationFilters.discipline && subjectsByDiscipline[simulationFilters.discipline]?.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </FilterGroup>

        <Button variant="outline" onClick={clearFilters}>
          Limpar Filtros
        </Button>
      </SimulationFilters>

      <ControlsBar>
        <SearchContainer>
          <SearchField
            type="text"
            placeholder="Buscar mapas mentais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={20} color="currentColor" />
        </SearchContainer>

        <ViewToggle>
          <ViewButton
            active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={16} />
            Grade
          </ViewButton>
          <ViewButton
            active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          >
            <List size={16} />
            Lista
          </ViewButton>
        </ViewToggle>
      </ControlsBar>

      <ResultsInfo>
        Mostrando {paginatedMindMaps.length} de {filteredMindMaps.length} mapas mentais
      </ResultsInfo>

      <MindMapsGrid viewMode={viewMode}>
        {paginatedMindMaps.map(mindMap => {
          const DisciplineIcon = getDisciplineIcon(mindMap.discipline);
          
          return (
            <MindMapCard 
              key={mindMap.id} 
              viewMode={viewMode}
              onClick={() => handleViewMindMap(mindMap)}
            >
              <MindMapThumbnail viewMode={viewMode}>
                <DisciplineIcon size={viewMode === 'grid' ? 32 : 24} />
              </MindMapThumbnail>
              
              <MindMapContent viewMode={viewMode}>
                <MindMapTitle viewMode={viewMode}>{mindMap.title}</MindMapTitle>
                
                <MindMapMeta viewMode={viewMode}>
                  <div className="discipline">{mindMap.discipline}</div>
                  <div className="theme">{mindMap.theme}</div>
                  <div className="description">{mindMap.description}</div>
                </MindMapMeta>
              </MindMapContent>
            </MindMapCard>
          );
        })}
      </MindMapsGrid>

      <Pagination>
        <PaginationButton
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          <ChevronLeft size={16} />
          Anterior
        </PaginationButton>
        
        <PaginationInfo>
          Página {currentPage} de {totalPages} ({filteredMindMaps.length} mapas mentais)
        </PaginationInfo>
        
        <PaginationButton
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Próxima
          <ChevronRight size={16} />
        </PaginationButton>
      </Pagination>

      {/* Modal para visualizar Mapa Mental */}
      {selectedMindMap && (
        <ModalOverlay onClick={handleCloseMindMap}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalHeaderInfo>
                <h2>{selectedMindMap.title}</h2>
                <div className="meta">
                  <div className="discipline">{selectedMindMap.discipline}</div>
                  <div className="theme">{selectedMindMap.theme}</div>
                </div>
                <div className="description">{selectedMindMap.description}</div>
              </ModalHeaderInfo>
              <CloseButton onClick={handleCloseMindMap}>
                <X />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <MindMapImage>
                {(() => {
                  const DisciplineIcon = getDisciplineIcon(selectedMindMap.discipline);
                  return <DisciplineIcon />;
                })()}
              </MindMapImage>
            </ModalBody>
            
            <ModalFooter>
              <DownloadButton onClick={() => handleDownload(selectedMindMap)}>
                <Download />
                Fazer Download
              </DownloadButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </MapasMentaisContainer>
  );
};

export default MapasMentais;