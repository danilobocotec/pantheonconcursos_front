import React from "react";
import styled from "styled-components";
import { Search, Menu, X, ArrowLeft } from "lucide-react";
import { Button, media, Card } from "../styles/GlobalStyles";

type VadeMecumCode = {
  id: string;
  nomecodigo: string;
  cabecalho: string;
  parte: string;
  idlivro: string;
  livro: string;
  livrotexto: string;
  idtitulo: string;
  titulo: string;
  titulotexto: string;
  idsubtitulo: string;
  subtitulo: string;
  subtitulotexto: string;
  idcapitulo: string;
  capitulo: string;
  capitulotexto: string;
  idsecao: string;
  secao: string;
  secaotexto: string;
  idsubsecao: string;
  subsecao: string;
  subsecaotexto: string;
  num_artigo: string;
  normativo: string;
  ordem: string;
  updatedAt?: string;
  createdAt?: string;
};

type VadeMecumGroup = {
  key: string;
  label: string;
  description: string;
  codes: VadeMecumCode[];
  createdAt?: string;
  updatedAt?: string;
};

const TOKEN_KEY = "pantheon:token";
const VADE_API_URL = "http://localhost:8080/api/v1/vade-mecum/codigos";

const VadeMecumContainer = styled.div`
  padding: 24px;
  background: ${(props) => props.theme.colors.background};
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
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 8px;
  }

  p {
    color: ${(props) => props.theme.colors.textSecondary};
    font-size: 16px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled(Card)`
  padding: 16px;

  p {
    color: ${(props) => props.theme.colors.textSecondary};
    margin-bottom: 6px;
  }

  strong {
    font-size: 26px;
    color: ${(props) => props.theme.colors.text};
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
    margin-right: ${(props) => (props.hasNavigation ? "0" : "0")};
  }
`;

const NavigationPanel = styled.div<{ isOpen: boolean }>`
  width: 280px;
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
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
    transform: ${(props) => (props.isOpen ? "translateX(0)" : "translateX(100%)")};
    transition: transform 0.3s ease;
    box-shadow: ${(props) =>
      props.isOpen ? "-5px 0 20px rgba(0, 0, 0, 0.3)" : "none"};
    overflow-y: auto;
    background: ${(props) => props.theme.colors.surface};
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
  background: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px ${(props) => props.theme.colors.shadow};
  transition: all 0.2s ease;
  z-index: 1001;
  opacity: 0.9;

  &:hover {
    background: ${(props) => props.theme.colors.accent};
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
  display: ${(props) => (props.isOpen ? "block" : "none")};

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
  color: ${(props) => props.theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;

const SearchField = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 6px;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;

  &:focus {
    border-color: ${(props) => props.theme.colors.accent};
    outline: none;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;

const SearchButton = styled(Button)`
  width: 100%;
  padding: 10px 16px;
  font-size: 14px;
`;

const ItemList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const ItemCard = styled(Card)`
  padding: 24px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${(props) => props.theme.colors.accent};
    transform: translateY(-2px);
  }

  h3 {
    color: ${(props) => props.theme.colors.text};
    font-weight: 700;
    margin-bottom: 6px;
    font-size: 18px;
  }

  p {
    color: ${(props) => props.theme.colors.textSecondary};
    font-size: 14px;
    margin: 0;
  }

  span {
    display: inline-block;
    margin-top: 12px;
    font-size: 12px;
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;

const ArticleContent = styled.div`
  line-height: 1.7;
  color: ${(props) => props.theme.colors.text};
  display: flex;
  flex-direction: column;
  gap: 16px;

  .article-block {
    background: ${(props) => props.theme.colors.surface};
    border: 1px solid ${(props) => props.theme.colors.border};
    border-radius: 12px;
    padding: 20px;

    &.highlighted {
      border-color: ${(props) => props.theme.colors.accent};
      box-shadow: 0 0 0 2px ${(props) => `${props.theme.colors.accent}33`};
    }

    h4 {
      font-size: 18px;
      margin-bottom: 8px;
      color: ${(props) => props.theme.colors.text};
    }

    p {
      margin: 0;
      color: ${(props) => props.theme.colors.textSecondary};
    }
  }
`;

const NavigationTree = styled.div`
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
  }
`;

const SectionTitle = styled.p`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: 8px;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

const SectionButton = styled.button<{ active?: boolean }>`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid
    ${(props) =>
      props.active ? props.theme.colors.accent : props.theme.colors.border};
  background: ${(props) =>
    props.active ? props.theme.colors.accent : props.theme.colors.background};
  color: ${(props) => (props.active ? "white" : props.theme.colors.text)};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.accentSecondary};
  }
`;

const ErrorMessage = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: ${(props) => `${props.theme.colors.accent}11`};
  color: ${(props) => props.theme.colors.accent};
  text-align: center;
  margin-bottom: 24px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: ${(props) => props.theme.colors.textSecondary};
  text-align: center;
  border: 2px dashed ${(props) => props.theme.colors.border};
  border-radius: 16px;

  h3 {
    font-size: 18px;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
  }
`;

const VadeMecum: React.FC = () => {
  const [codes, setCodes] = React.useState<VadeMecumCode[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedGroupKey, setSelectedGroupKey] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [articleQuery, setArticleQuery] = React.useState("");
  const [sectionFilter, setSectionFilter] = React.useState<string | null>(null);
  const [focusedArticleId, setFocusedArticleId] = React.useState<string | null>(null);
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsNavOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const loadCodes = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem(TOKEN_KEY)
          : null;
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(VADE_API_URL, { headers });
      if (!response.ok) {
        throw new Error(`Falha ao carregar registros (${response.status})`);
      }
      const payload = await response.json();
      setCodes(normalizeCollection(payload));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar dados."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadCodes();
  }, [loadCodes]);

  const summaryCards = React.useMemo(() => {
    const distinct = (values: string[]) =>
      new Set(values.filter((value) => Boolean(value))).size;
    return [
      { label: "Total de registros", value: codes.length },
      {
        label: "Codigos distintos",
        value: distinct(codes.map((code) => code.nomecodigo || code.id)),
      },
      {
        label: "Secoes distintas",
        value: distinct(codes.map((code) => code.secao)),
      },
    ];
  }, [codes]);

  const groupedCodes = React.useMemo<VadeMecumGroup[]>(() => {
    const map = new Map<string, VadeMecumGroup>();
    codes.forEach((code) => {
      const key = code.nomecodigo?.trim() || code.id;
      if (!map.has(key)) {
        map.set(key, {
          key,
          label: code.nomecodigo || `Codigo ${key}`,
          description: code.cabecalho || "",
          codes: [code],
          createdAt: code.createdAt,
          updatedAt: code.updatedAt,
        });
      } else {
        map.get(key)!.codes.push(code);
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      (a.label || "").localeCompare(b.label || "", "pt-BR")
    );
  }, [codes]);

  React.useEffect(() => {
    if (
      selectedGroupKey &&
      !groupedCodes.some((group) => group.key === selectedGroupKey)
    ) {
      setSelectedGroupKey(null);
    }
  }, [groupedCodes, selectedGroupKey]);

  const currentGroup = React.useMemo(
    () =>
      groupedCodes.find((group) => group.key === selectedGroupKey) || null,
    [groupedCodes, selectedGroupKey]
  );

  const articles = currentGroup?.codes ?? [];

  const matchesArticleQuery = React.useCallback(
    (article: VadeMecumCode) => {
      if (!articleQuery.trim()) return true;
      return (
        article.num_artigo
          ?.toLowerCase()
          .includes(articleQuery.toLowerCase()) ?? false
      );
    },
    [articleQuery]
  );

  const filteredArticles = React.useMemo(
    () =>
      articles.filter(
        (article) =>
          matchesArticleQuery(article) &&
          (!sectionFilter || article.secao === sectionFilter)
      ),
    [articles, matchesArticleQuery, sectionFilter]
  );

  const sectionEntries = React.useMemo(() => {
    const buckets = articles.reduce<Record<string, VadeMecumCode[]>>(
      (accumulator, article) => {
        const section = article.secao?.trim() || "Sem secao";
        if (!accumulator[section]) accumulator[section] = [];
        accumulator[section].push(article);
        return accumulator;
      },
      {}
    );
    return Object.entries(buckets).sort((a, b) =>
      a[0].localeCompare(b[0], "pt-BR")
    );
  }, [articles]);

  const filteredGroups = React.useMemo(() => {
    if (!searchTerm.trim()) return groupedCodes;
    const term = searchTerm.toLowerCase();
    return groupedCodes.filter(
      (group) =>
        group.label.toLowerCase().includes(term) ||
        (group.description || "").toLowerCase().includes(term)
    );
  }, [groupedCodes, searchTerm]);

  const handleArticleSelect = React.useCallback((articleId: string) => {
    setFocusedArticleId(articleId);
    if (typeof document !== "undefined") {
      const target = document.getElementById(`article-${articleId}`);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (isMobile) {
      setIsNavOpen(false);
    }
  }, [isMobile]);

  const openGroup = (groupKey: string) => {
    setSelectedGroupKey(groupKey);
    setArticleQuery("");
    setSectionFilter(null);
    setFocusedArticleId(null);
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const resetDetail = () => {
    setSelectedGroupKey(null);
    setArticleQuery("");
    setSectionFilter(null);
    setFocusedArticleId(null);
  };

  const highlightArticle = articles[0];

  return (
    <VadeMecumContainer>
      <Header>
        <h1>Vade Mecum Digital</h1>
        <p>
          Consulte os codigos oficiais, visualize seus artigos e navegue por
          secoes especificas.
        </p>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <StatsGrid>
        {summaryCards.map((card) => (
          <StatCard key={card.label}>
            <p>{card.label}</p>
            <strong>{card.value}</strong>
          </StatCard>
        ))}
      </StatsGrid>

      {!selectedGroupKey && (
        <>
          <SearchContainer>
            <SearchField
              type="text"
              placeholder="Buscar por nome ou cabecalho..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <SearchButton onClick={() => setSearchTerm("")}>
              Limpar
            </SearchButton>
            <SearchButton onClick={loadCodes}>Atualizar</SearchButton>
          </SearchContainer>
          {loading ? (
            <ItemList>
              {Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  style={{ height: 140, opacity: 0.4, borderStyle: "dashed" }}
                />
              ))}
            </ItemList>
          ) : filteredGroups.length === 0 ? (
            <EmptyState>
              <h3>Nenhum codigo encontrado</h3>
              <p>Ajuste os filtros ou tente novamente mais tarde.</p>
            </EmptyState>
          ) : (
            <ItemList>
              {filteredGroups.map((group) => (
                <ItemCard key={group.key} onClick={() => openGroup(group.key)}>
                  <h3>{group.label}</h3>
                  <p>{group.description || "Sem descricao cadastrada."}</p>
                  {(group.updatedAt || group.createdAt) && (
                    <span>
                      Atualizado em{" "}
                      {formatDate(group.updatedAt || group.createdAt || "-")}
                    </span>
                  )}
                </ItemCard>
              ))}
            </ItemList>
          )}
        </>
      )}

      {selectedGroupKey && currentGroup && (
        <>
          <MobileNavButton onClick={() => setIsNavOpen(true)}>
            <Menu size={20} />
          </MobileNavButton>
          <MobileNavOverlay isOpen={isNavOpen} onClick={() => setIsNavOpen(false)} />
          <ContentArea>
            <MainContent hasNavigation ref={contentRef}>
              <button
                type="button"
                onClick={resetDetail}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 600,
                  color: "#f97316",
                  marginBottom: 16,
                }}
              >
                <ArrowLeft size={18} />
                Voltar para lista
              </button>

              <ArticleContent>
                <Card style={{ padding: 24 }}>
                  <h2 style={{ marginBottom: 8 }}>{currentGroup.label}</h2>
                  <p style={{ color: "var(--text-secondary)" }}>
                    {currentGroup.description || "Sem cabecalho cadastrado."}
                  </p>
                  {highlightArticle && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: 16,
                        marginTop: 24,
                      }}
                    >
                      {[
                        { label: "Parte", value: highlightArticle.parte || "-" },
                        {
                          label: "Livro",
                          value: highlightArticle.livrotexto || highlightArticle.livro || "-",
                        },
                        {
                          label: "Titulo",
                          value: highlightArticle.titulotexto || highlightArticle.titulo || "-",
                        },
                        {
                          label: "Subtitulo",
                          value:
                            highlightArticle.subtitulotexto ||
                            highlightArticle.subtitulo ||
                            "-",
                        },
                        {
                          label: "Capitulo",
                          value:
                            highlightArticle.capitulotexto ||
                            highlightArticle.capitulo ||
                            "-",
                        },
                        {
                          label: "Secao",
                          value: highlightArticle.secaotexto || highlightArticle.secao || "-",
                        },
                        {
                          label: "Normativo",
                          value: highlightArticle.normativo || "-",
                        },
                        {
                          label: "Ordem",
                          value: highlightArticle.ordem || "-",
                        },
                      ].map((item) => (
                        <div key={item.label}>
                          <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                            {item.label}
                          </p>
                          <strong>{item.value}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {filteredArticles.length === 0 && (
                  <EmptyState>
                    <h3>Nenhum artigo encontrado</h3>
                    <p>Altere os filtros aplicados para visualizar os artigos.</p>
                  </EmptyState>
                )}

                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    id={`article-${article.id}`}
                    className={`article-block ${
                      focusedArticleId === article.id ? "highlighted" : ""
                    }`}
                  >
                    <h4>Art. {article.num_artigo || "-"}</h4>
                    <p>{article.cabecalho || currentGroup.description}</p>
                    <div style={{ fontSize: 13, marginTop: 12 }}>
                      <p>
                        <strong>Livro:</strong>{" "}
                        {article.livrotexto || article.livro || "-"}
                      </p>
                      <p>
                        <strong>Titulo:</strong>{" "}
                        {article.titulotexto || article.titulo || "-"}
                      </p>
                      <p>
                        <strong>Capitulo:</strong>{" "}
                        {article.capitulotexto || article.capitulo || "-"}
                      </p>
                      <p>
                        <strong>Secao:</strong>{" "}
                        {article.secaotexto || article.secao || "-"}
                      </p>
                      <p>
                        <strong>Subseccao:</strong>{" "}
                        {article.subsecaotexto || article.subsecao || "-"}
                      </p>
                      <p>
                        <strong>Atualizado em:</strong>{" "}
                        {article.updatedAt ? formatDate(article.updatedAt) : "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </ArticleContent>
            </MainContent>

            <NavigationPanel isOpen={isNavOpen}>
              <CloseNavButton onClick={() => setIsNavOpen(false)}>
                <X size={16} />
              </CloseNavButton>
              <SearchContainer>
                <SearchField
                  type="text"
                  placeholder="Buscar artigo (ex: 12)"
                  value={articleQuery}
                  onChange={(event) => setArticleQuery(event.target.value)}
                />
                <SearchButton onClick={() => setArticleQuery("")}>
                  Limpar
                </SearchButton>
              </SearchContainer>
              <NavigationTree>
                <h3>Navegacao por secoes</h3>
                {sectionEntries.map(([sectionName, sectionArticles]) => {
                  const isActive = sectionFilter === sectionName;
                  return (
                    <div key={sectionName} style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 6,
                        }}
                      >
                        <SectionTitle>{sectionName}</SectionTitle>
                        <button
                          type="button"
                          onClick={() =>
                            setSectionFilter(isActive ? null : sectionName)
                          }
                          style={{
                            fontSize: 11,
                            color: "#f97316",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {isActive ? "Limpar" : "Filtrar"}
                        </button>
                      </div>
                      <SectionGrid>
                        {sectionArticles
                          .filter((article) => matchesArticleQuery(article))
                          .map((article) => (
                            <SectionButton
                              key={article.id}
                              type="button"
                              active={focusedArticleId === article.id}
                              onClick={() => handleArticleSelect(article.id)}
                            >
                              Art. {article.num_artigo || "-"}
                            </SectionButton>
                          ))}
                      </SectionGrid>
                    </div>
                  );
                })}
              </NavigationTree>
            </NavigationPanel>
          </ContentArea>
        </>
      )}
    </VadeMecumContainer>
  );
};

const normalizeRecord = (item: any, index: number): VadeMecumCode => ({
  id: String(item?.id ?? item?.uuid ?? index),
  nomecodigo: item?.nomecodigo || item?.titulo || `Codigo ${index + 1}`,
  cabecalho: item?.cabecalho || "",
  parte: item?.parte || item?.PARTE || "",
  idlivro: item?.idlivro || "",
  livro: item?.livro || "",
  livrotexto: item?.livrotexto || "",
  idtitulo: item?.idtitulo || "",
  titulo: item?.titulo || "",
  titulotexto: item?.titulotexto || "",
  idsubtitulo: item?.idsubtitulo || "",
  subtitulo: item?.subtitulo || "",
  subtitulotexto: item?.subtitulotexto || "",
  idcapitulo: item?.idcapitulo || "",
  capitulo: item?.capitulo || "",
  capitulotexto: item?.capitulotexto || "",
  idsecao: item?.idsecao || "",
  secao: item?.secao || "",
  secaotexto: item?.secaotexto || "",
  idsubsecao: item?.idsubsecao || "",
  subsecao: item?.subsecao || "",
  subsecaotexto: item?.subsecaotexto || "",
  num_artigo: item?.num_artigo || "",
  normativo: item?.Normativo || item?.normativo || "",
  ordem: item?.Ordem || item?.ordem || "",
  updatedAt:
    item?.updated_at ||
    item?.updatedAt ||
    item?.atualizado_em ||
    item?.created_at ||
    "",
  createdAt: item?.created_at || item?.createdAt || "",
});

const normalizeCollection = (payload: any): VadeMecumCode[] => {
  if (!payload) return [];
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload?.data)
    ? payload.data
    : [];
  return items.map((item, index) => normalizeRecord(item, index));
};

const formatDate = (value: string) => {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Date(parsed).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default VadeMecum;
