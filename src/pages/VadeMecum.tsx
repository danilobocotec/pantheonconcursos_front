import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  BookOpen, 
  Scale, 
  FileText, 
  Gavel,
  Users,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { Card, Button, media } from '../styles/GlobalStyles';

interface LegalText {
  id: string;
  title: string;
  type: 'constitution' | 'code' | 'law' | 'jurisprudence' | 'oab' | 'statute';
  content: {
    titles?: Title[];
    articles?: Article[];
    summaries?: Summary[];
  };
}

interface Title {
  id: string;
  number: string;
  name: string;
  chapters?: Chapter[];
  articles?: Article[];
}

interface Chapter {
  id: string;
  number: string;
  name: string;
  articles: Article[];
}

interface Article {
  id: string;
  number: string;
  text: string;
  paragraphs?: string[];
  items?: string[];
}

interface Summary {
  id: string;
  number: string;
  court: string;
  text: string;
  binding: boolean;
}

const VadeMecumContainer = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;
  position: relative;

  ${media.mobile} {
    padding: 60px 16px 16px 16px;
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 28px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 8px;
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 16px;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  overflow-x: auto;
  padding-bottom: 8px;
  
  ${media.mobile} {
    flex-wrap: wrap;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? props.theme.colors.accent : props.theme.colors.surface};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;

  &:hover {
    background: ${props => props.active ? props.theme.colors.accentSecondary : `${props.theme.colors.accentSecondary}15`};
    color: ${props => props.active ? 'white' : props.theme.colors.accentSecondary};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ContentArea = styled.div`
  display: flex;
  gap: 24px;
  
  ${media.mobile} {
    flex-direction: column;
  }
`;

const MainContent = styled.div<{ hasNavigation: boolean }>`
  flex: 1;
  
  ${media.mobile} {
    margin-right: ${props => props.hasNavigation ? '0' : '0'};
  }
`;

const NavigationPanel = styled.div<{ isOpen: boolean }>`
  width: 280px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  height: fit-content;
  position: sticky;
  top: 24px;
  
  ${media.mobile} {
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100vh;
    z-index: 1000;
    border-radius: 0;
    border-right: none;
    border-top: none;
    border-bottom: none;
    padding-top: 60px;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.3s ease;
    box-shadow: ${props => props.isOpen ? '-5px 0 20px rgba(0, 0, 0, 0.3)' : 'none'};
    overflow-y: auto;
  }
`;

const MobileNavButton = styled.button`
  position: fixed;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: none;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px ${props => props.theme.colors.shadow};
  transition: all 0.2s ease;
  z-index: 1001;
  opacity: 0.9;

  &:hover {
    background: ${props => props.theme.colors.accent};
    color: white;
    transform: scale(1.05);
  }

  ${media.mobile} {
    display: flex;
  }
`;

const MobileNavOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.isOpen ? 'block' : 'none'};
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const CloseNavButton = styled.button`
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

const SearchContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
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

const SearchButton = styled(Button)`
  padding: 10px 16px;
  font-size: 14px;
`;

const ItemList = styled.div`
  display: grid;
  gap: 16px;
  margin-bottom: 32px;
`;

const ItemCard = styled(Card)<{ active?: boolean }>`
  padding: 20px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? props.theme.colors.accent : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.accentSecondary};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.colors.shadow};
  }

  h3 {
    color: #FFFFFF;
    font-weight: bold;
    margin-bottom: 8px;
    font-size: 16px;
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 14px;
    margin: 0;
  }
`;

const ArticleContent = styled.div`
  line-height: 1.8;
  color: ${props => props.theme.colors.text};

  .article {
    margin-bottom: 24px;
    padding: 16px;
    background: ${props => props.theme.colors.surface};
    border-radius: 8px;
    border-left: 4px solid ${props => props.theme.colors.accent};

    .article-number {
      font-weight: 700;
      color: ${props => props.theme.colors.accent};
      margin-bottom: 8px;
    }

    .article-text {
      margin-bottom: 12px;
    }

    .paragraph {
      margin-left: 20px;
      margin-bottom: 8px;
      position: relative;

      &::before {
        content: '§';
        position: absolute;
        left: -15px;
        color: ${props => props.theme.colors.textSecondary};
      }
    }

    .item {
      margin-left: 40px;
      margin-bottom: 4px;
      position: relative;

      &::before {
        content: attr(data-roman);
        position: absolute;
        left: -25px;
        color: ${props => props.theme.colors.textSecondary};
        font-weight: 600;
      }
    }
  }
`;

const NavigationTree = styled.div`
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const TreeItem = styled.div<{ level: number; active?: boolean }>`
  padding: 6px 12px;
  margin-left: ${props => props.level * 16}px;
  cursor: pointer;
  border-radius: 4px;
  font-size: ${props => 14 - props.level}px;
  background: ${props => props.active ? props.theme.colors.accent : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  transition: all 0.2s ease;
  margin-bottom: 2px;

  &:hover {
    background: ${props => props.active ? props.theme.colors.accentSecondary : `${props.theme.colors.accentSecondary}15`};
    color: ${props => props.active ? 'white' : props.theme.colors.accentSecondary};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  h3 {
    font-size: 18px;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
  }
`;

const VadeMecum: React.FC = () => {
  const [activeTab, setActiveTab] = useState('constitution');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentText, setCurrentText] = useState<LegalText | null>(null);
  const [activeArticle, setActiveArticle] = useState<string>('');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsNavOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const tabs = [
    { id: 'constitution', name: 'Constituição', icon: Scale },
    { id: 'codes', name: 'Códigos', icon: BookOpen },
    { id: 'laws', name: 'Leis', icon: FileText },
    { id: 'jurisprudence', name: 'Jurisprudência', icon: Gavel },
    { id: 'oab', name: 'OAB', icon: Shield },
    { id: 'statutes', name: 'Estatutos', icon: Users }
  ];

  const categories = {
    constitution: {
      name: 'Constituição',
      items: [
        { id: 'cf88', name: 'Constituição Federal de 1988', description: 'Carta Magna do Brasil' }
      ]
    },
    codes: {
      name: 'Códigos',
      items: [
        { id: 'cc', name: 'Código Civil', description: 'Lei 10.406/2002' },
        { id: 'cpc', name: 'Código de Processo Civil', description: 'Lei 13.105/2015' },
        { id: 'cp', name: 'Código Penal', description: 'Decreto-Lei 2.848/1940' },
        { id: 'cpp', name: 'Código de Processo Penal', description: 'Decreto-Lei 3.689/1941' },
        { id: 'clt', name: 'CLT - Consolidação das Leis do Trabalho', description: 'Decreto-Lei 5.452/1943' },
        { id: 'cdc', name: 'Código de Defesa do Consumidor', description: 'Lei 8.078/1990' },
        { id: 'ctn', name: 'Código Tributário Nacional', description: 'Lei 5.172/1966' },
        { id: 'ce', name: 'Código Eleitoral', description: 'Lei 4.737/1965' }
      ]
    },
    laws: {
      name: 'Leis',
      items: [
        { id: 'lei8666', name: 'Lei 8.666/93 - Licitações', description: 'Normas para licitações e contratos' },
        { id: 'lei4717', name: 'Lei 4.717/65 - Ação Popular', description: 'Regula a ação popular' },
        { id: 'lei8429', name: 'Lei 8.429/92 - Improbidade Administrativa', description: 'Sanções por improbidade' },
        { id: 'lei12527', name: 'Lei 12.527/11 - Acesso à Informação', description: 'Lei de Acesso à Informação' },
        { id: 'lgpd', name: 'Lei 13.709/18 - LGPD', description: 'Lei Geral de Proteção de Dados' },
        { id: 'lei11101', name: 'Lei 11.101/05 - Falências', description: 'Recuperação judicial e falência' },
        { id: 'lei9784', name: 'Lei 9.784/99 - Processo Administrativo', description: 'Processo administrativo federal' }
      ]
    },
    jurisprudence: {
      name: 'Jurisprudência',
      items: [
        { id: 'stf', name: 'STF - Supremo Tribunal Federal', description: 'Súmulas e jurisprudência do STF' },
        { id: 'stj', name: 'STJ - Superior Tribunal de Justiça', description: 'Súmulas e jurisprudência do STJ' },
        { id: 'tst', name: 'TST - Tribunal Superior do Trabalho', description: 'Súmulas e jurisprudência do TST' },
        { id: 'tse', name: 'TSE - Tribunal Superior Eleitoral', description: 'Súmulas e jurisprudência do TSE' }
      ]
    },
    oab: {
      name: 'OAB',
      items: [
        { id: 'estatuto', name: 'Estatuto da OAB', description: 'Lei 8.906/1994' },
        { id: 'etica', name: 'Código de Ética', description: 'Código de Ética e Disciplina da OAB' },
        { id: 'regulamento', name: 'Regulamento Geral', description: 'Regulamento Geral do Estatuto da OAB' },
        { id: 'exame', name: 'Regulamento do Exame de Ordem', description: 'Provimento 144/2011 do Conselho Federal' }
      ]
    },
    statutes: {
      name: 'Estatutos',
      items: [
        { id: 'servidor', name: 'Estatuto do Servidor Público Federal', description: 'Lei 8.112/1990' },
        { id: 'cidade', name: 'Estatuto da Cidade', description: 'Lei 10.257/2001' },
        { id: 'indio', name: 'Estatuto do Índio', description: 'Lei 6.001/1973' },
        { id: 'desarmamento', name: 'Estatuto do Desarmamento', description: 'Lei 10.826/2003' },
        { id: 'idoso', name: 'Estatuto do Idoso', description: 'Lei 10.741/2003' },
        { id: 'crianca', name: 'Estatuto da Criança e do Adolescente', description: 'Lei 8.069/1990' }
      ]
    }
  };

  // Mock data para demonstração
  const mockLegalTexts: { [key: string]: LegalText } = {
    'cc': {
      id: 'cc',
      title: 'Código Civil',
      type: 'code',
      content: {
        titles: [
          {
            id: 'titulo1',
            number: 'I',
            name: 'Das Pessoas Naturais',
            chapters: [
              {
                id: 'cap1',
                number: 'I',
                name: 'Da Personalidade e da Capacidade',
                articles: [
                  {
                    id: 'art1',
                    number: '1º',
                    text: 'Toda pessoa é capaz de direitos e deveres na ordem civil.'
                  },
                  {
                    id: 'art2',
                    number: '2º',
                    text: 'A personalidade civil da pessoa começa do nascimento com vida; mas a lei põe a salvo, desde a concepção, os direitos do nascituro.'
                  },
                  {
                    id: 'art3',
                    number: '3º',
                    text: 'São absolutamente incapazes de exercer pessoalmente os atos da vida civil os menores de 16 (dezesseis) anos.',
                    paragraphs: [
                      'I - os menores de dezesseis anos;',
                      'II - os que, por enfermidade ou deficiência mental, não tiverem o necessário discernimento para a prática desses atos;',
                      'III - os que, mesmo por causa transitória, não puderem exprimir sua vontade.'
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    'cf88': {
      id: 'cf88',
      title: 'Constituição Federal de 1988',
      type: 'constitution',
      content: {
        titles: [
          {
            id: 'titulo1',
            number: 'I',
            name: 'Dos Princípios Fundamentais',
            articles: [
              {
                id: 'art1',
                number: '1º',
                text: 'A República Federativa do Brasil, formada pela união indissolúvel dos Estados e Municípios e do Distrito Federal, constitui-se em Estado Democrático de Direito e tem como fundamentos:',
                items: [
                  'I - a soberania;',
                  'II - a cidadania;',
                  'III - a dignidade da pessoa humana;',
                  'IV - os valores sociais do trabalho e da livre iniciativa;',
                  'V - o pluralismo político.'
                ],
                paragraphs: [
                  'Parágrafo único. Todo o poder emana do povo, que o exerce por meio de representantes eleitos ou diretamente, nos termos desta Constituição.'
                ]
              }
            ]
          }
        ]
      }
    }
  };

  const selectItem = (itemId: string) => {
    setSelectedItem(itemId);
    const legalText = mockLegalTexts[itemId];
    if (legalText) {
      setCurrentText(legalText);
    }
  };

  const scrollToArticle = (articleId: string) => {
    setActiveArticle(articleId);
    const element = document.getElementById(articleId);
    if (element && contentRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (isMobile) {
      setIsNavOpen(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm || !currentText) return;
    
    // Remove pontos e converte para número
    const cleanNumber = searchTerm.replace(/\./g, '');
    const articleNumber = parseInt(cleanNumber);
    
    if (isNaN(articleNumber)) return;
    
    // Busca o artigo pelo número
    const findArticle = (titles: Title[]): Article | null => {
      for (const title of titles) {
        if (title.articles) {
          const article = title.articles.find(art => 
            parseInt(art.number.replace(/[^\d]/g, '')) === articleNumber
          );
          if (article) return article;
        }
        if (title.chapters) {
          for (const chapter of title.chapters) {
            const article = chapter.articles.find(art => 
              parseInt(art.number.replace(/[^\d]/g, '')) === articleNumber
            );
            if (article) return article;
          }
        }
      }
      return null;
    };

    if (currentText.content.titles) {
      const article = findArticle(currentText.content.titles);
      if (article) {
        scrollToArticle(article.id);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getCurrentCategory = () => {
    return categories[activeTab as keyof typeof categories];
  };

  const toggleNavigation = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNavigation = () => {
    setIsNavOpen(false);
  };

  const renderNavigationTree = () => {
    if (!currentText || !currentText.content.titles) return null;

    return (
      <NavigationTree>
        <h3>Navegação</h3>
        {currentText.content.titles.map(title => (
          <div key={title.id}>
            <TreeItem level={0}>
              Título {title.number} - {title.name}
            </TreeItem>
            {title.chapters?.map(chapter => (
              <div key={chapter.id}>
                <TreeItem level={1}>
                  Capítulo {chapter.number} - {chapter.name}
                </TreeItem>
                {chapter.articles.map(article => (
                  <TreeItem
                    key={article.id}
                    level={2}
                    active={activeArticle === article.id}
                    onClick={() => scrollToArticle(article.id)}
                  >
                    Art. {article.number}
                  </TreeItem>
                ))}
              </div>
            ))}
            {title.articles?.map(article => (
              <TreeItem
                key={article.id}
                level={1}
                active={activeArticle === article.id}
                onClick={() => scrollToArticle(article.id)}
              >
                Art. {article.number}
              </TreeItem>
            ))}
          </div>
        ))}
      </NavigationTree>
    );
  };

  const renderContent = () => {
    const category = getCurrentCategory();
    
    if (!currentText) {
      return (
        <ItemList>
          {category.items.map(item => (
            <ItemCard
              key={item.id}
              active={selectedItem === item.id}
              onClick={() => selectItem(item.id)}
            >
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </ItemCard>
          ))}
        </ItemList>
      );
    }

    const renderArticles = (articles: Article[]) => {
      return articles.map(article => (
        <div key={article.id} id={article.id} className="article">
          <div className="article-number">Art. {article.number}</div>
          <div className="article-text">{article.text}</div>
          {article.paragraphs?.map((paragraph, index) => (
            <div key={index} className="paragraph">
              {paragraph}
            </div>
          ))}
          {article.items?.map((item, index) => (
            <div key={index} className="item" data-roman={['I', 'II', 'III', 'IV', 'V'][index]}>
              {item}
            </div>
          ))}
        </div>
      ));
    };

    return (
      <ArticleContent>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--accent-color)', marginBottom: '8px' }}>{currentText.title}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{category.name} › {currentText.title}</p>
        </div>
        
        {currentText.content.titles?.map(title => (
          <div key={title.id}>
            <h2 style={{ marginBottom: '24px', color: 'var(--accent-color)' }}>
              Título {title.number} - {title.name}
            </h2>
            {title.chapters?.map(chapter => (
              <div key={chapter.id} style={{ marginBottom: '32px' }}>
                <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                  Capítulo {chapter.number} - {chapter.name}
                </h3>
                {renderArticles(chapter.articles)}
              </div>
            ))}
            {title.articles && renderArticles(title.articles)}
          </div>
        ))}
      </ArticleContent>
    );
  };

  return (
    <VadeMecumContainer>
      <Header>
        <h1>Vade Mecum</h1>
        <p>Consulte leis, códigos e jurisprudência de forma organizada</p>
      </Header>

      <TabsContainer>
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedItem('');
              setCurrentText(null);
            }}
          >
            <tab.icon />
            {tab.name}
          </Tab>
        ))}
      </TabsContainer>

      {currentText && (
        <MobileNavButton onClick={toggleNavigation}>
          <Menu size={20} />
        </MobileNavButton>
      )}

      <MobileNavOverlay isOpen={isNavOpen} onClick={closeNavigation} />

      <ContentArea>
        <MainContent hasNavigation={!!currentText} ref={contentRef}>
          {renderContent()}
        </MainContent>

        {currentText && (
          <NavigationPanel isOpen={isNavOpen}>
            <CloseNavButton onClick={closeNavigation}>
              <X size={16} />
            </CloseNavButton>
            
            <SearchContainer>
              <SearchField
                type="text"
                placeholder="Buscar artigo (ex: 1230 ou 1.230)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <SearchButton onClick={handleSearch}>
                <Search size={16} />
              </SearchButton>
            </SearchContainer>
            {renderNavigationTree()}
          </NavigationPanel>
        )}
      </ContentArea>
    </VadeMecumContainer>
  );
};

export default VadeMecum;