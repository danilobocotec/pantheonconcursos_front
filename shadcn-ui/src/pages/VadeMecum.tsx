import React from "react";
import styled from "styled-components";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Gavel,
  Menu,
  Scale,
  Shield,
  Users,
  X,
} from "lucide-react";
import { media, Card } from "../styles/GlobalStyles";

type VadeMecumCode = {
  id: string;
  tipo: string;
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
  tipo: string;
  label: string;
  description: string;
  codes: VadeMecumCode[];
  createdAt?: string;
  updatedAt?: string;
};

type VadeMecumJurisprudence = {
  id: string;
  nomecodigo: string;
  normativo: string;
  enunciado: string;
  num_artigo: string;
  cabecalho: string;
  ramo?: string;
  assunto?: string;
};

type VadeMecumJurisprudenceGroup = {
  id: string;
  nomecodigo: string;
  descricao?: string;
  quantidade?: number;
};

type VadeMecumLawGroup = {
  id: string;
  nomecodigo: string;
  descricao?: string;
  quantidade?: number;
};

type VadeMecumLawArticle = {
  id: string;
  numero?: string;
  texto: string;
};

type VadeMecumLawDetail = {
  tipo?: string;
  nomecodigo: string;
  titulo?: string;
  artigos: VadeMecumLawArticle[];
};

const TOKEN_KEY = "pantheon:token";
const VADE_CAPAS_API_URL =
  "http://localhost:8080/api/v1/vade-mecum/codigos/capas";
const VADE_CODIGOS_API_URL =
  "http://localhost:8080/api/v1/vade-mecum/codigos";
const VADE_JURIS_GROUPED_API_URL =
  "http://localhost:8080/api/v1/vade-mecum/jurisprudencia/grouped";
const VADE_JURIS_API_URL =
  "http://localhost:8080/api/v1/vade-mecum/jurisprudencia";
const VADE_LAWS_GROUPED_API_URL =
  "http://localhost:8080/api/v1/vade-mecum/leis/gruposervico";
const VADE_LAWS_API_URL = "http://localhost:8080/api/v1/vade-mecum/leis";

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

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.border};
    border-radius: 999px;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: ${(props) =>
    props.active ? props.theme.colors.accent : props.theme.colors.surface};
  color: ${(props) => (props.active ? "white" : props.theme.colors.text)};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;

  &:hover {
    background: ${(props) =>
      props.active
        ? props.theme.colors.accentSecondary
        : `${props.theme.colors.accentSecondary}15`};
    color: ${(props) => (props.active ? "white" : props.theme.colors.accentSecondary)};
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
  display: flex;
  flex-direction: column;
  gap: 16px;

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
    transform: ${(props) =>
      props.isOpen ? "translateX(0)" : "translateX(100%)"};
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

const SearchButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.border};
  background: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.accent};
    color: ${(props) => props.theme.colors.accent};
  }
`;

const FilterGroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 6px;

  ${media.mobile} {
    max-height: calc(100vh - 220px);
  }
`;

const FilterGroupTitle = styled.p`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 6px 0;
`;

const FilterGroupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

const FilterEmptyState = styled.p`
  font-size: 12px;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const ArticleButton = styled.button<{ active?: boolean }>`
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
`;

const ItemList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 32px;
`;

const GroupSection = styled.div`
  margin-bottom: 32px;
`;

const GroupTitle = styled.h2`
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0 0 12px 0;
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

const ArticleParagraph = styled.p<{ focused: boolean }>`
  white-space: pre-wrap;
  scroll-margin-top: 90px;
  border-radius: 8px;
  border: 1px solid
    ${(props) => (props.focused ? props.theme.colors.accent : "transparent")};
  padding: ${(props) => (props.focused ? "10px 12px" : "0px")};
  background: transparent;
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0;

  .article-prefix {
    font-weight: 700;
    color: ${(props) => props.theme.colors.accent};
    margin-right: 6px;
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
  const [selectedGroup, setSelectedGroup] = React.useState<VadeMecumGroup | null>(null);
  const [selectedGroupCodes, setSelectedGroupCodes] = React.useState<VadeMecumCode[]>([]);
  const [selectedLoading, setSelectedLoading] = React.useState(false);
  const [selectedError, setSelectedError] = React.useState<string | null>(null);
  const [articleQuery, setArticleQuery] = React.useState("");
  const [focusedArticleId, setFocusedArticleId] = React.useState<string | null>(null);
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<
    "constitution" | "codes" | "laws" | "jurisprudence" | "oab" | "statutes"
  >("codes");
  const [isMobile, setIsMobile] = React.useState(false);
  const [jurisprudenceGroups, setJurisprudenceGroups] = React.useState<VadeMecumJurisprudenceGroup[]>([]);
  const [jurisprudenceLoading, setJurisprudenceLoading] = React.useState(false);
  const [jurisprudenceError, setJurisprudenceError] = React.useState<string | null>(null);
  const [selectedJurisprudenceName, setSelectedJurisprudenceName] = React.useState<string | null>(null);
  const [selectedJurisprudenceItems, setSelectedJurisprudenceItems] = React.useState<VadeMecumJurisprudence[]>([]);
  const [selectedJurisprudenceLoading, setSelectedJurisprudenceLoading] = React.useState(false);
  const [selectedJurisprudenceError, setSelectedJurisprudenceError] = React.useState<string | null>(null);
  const [lawGroups, setLawGroups] = React.useState<VadeMecumLawGroup[]>([]);
  const [lawLoading, setLawLoading] = React.useState(false);
  const [lawError, setLawError] = React.useState<string | null>(null);
  const isLawDetail = React.useMemo(
    () => Boolean(selectedGroupKey?.startsWith("law-")),
    [selectedGroupKey]
  );
  const [selectedLawDetail, setSelectedLawDetail] = React.useState<VadeMecumLawDetail | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const normalizeText = React.useCallback((value: string) => {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }, []);

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
      const response = await fetch(VADE_CAPAS_API_URL, { headers });
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

  const loadJurisprudenceGroups = React.useCallback(async () => {
    setJurisprudenceLoading(true);
    setJurisprudenceError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem(TOKEN_KEY)
          : null;
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(VADE_JURIS_GROUPED_API_URL, { headers });
      if (!response.ok) {
        throw new Error(`Falha ao carregar jurisprudencia (${response.status})`);
      }
      const payload = await response.json();
      setJurisprudenceGroups(normalizeJurisprudenceGroups(payload));
    } catch (requestError) {
      setJurisprudenceError(
        requestError instanceof Error ? requestError.message : "Erro ao carregar dados."
      );
    } finally {
      setJurisprudenceLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadJurisprudenceGroups();
  }, [loadJurisprudenceGroups]);

  const loadLawGroups = React.useCallback(async () => {
    setLawLoading(true);
    setLawError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem(TOKEN_KEY)
          : null;
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(VADE_LAWS_GROUPED_API_URL, { headers });
      if (!response.ok) {
        throw new Error(`Falha ao carregar leis (${response.status})`);
      }
      const payload = await response.json();
      setLawGroups(normalizeLawGroups(payload));
    } catch (requestError) {
      setLawError(
        requestError instanceof Error ? requestError.message : "Erro ao carregar leis."
      );
    } finally {
      setLawLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadLawGroups();
  }, [loadLawGroups]);

  const openJurisprudenceGroup = React.useCallback(
    (nomecodigo: string) => {
      const trimmed = nomecodigo?.trim();
      if (!trimmed) return;
      setSelectedGroupKey(null);
      setSelectedGroup(null);
      setSelectedGroupCodes([]);
      setSelectedError(null);
      setSelectedLawDetail(null);
      setSelectedJurisprudenceName(trimmed);
      setSelectedJurisprudenceItems([]);
      setSelectedJurisprudenceError(null);
      setArticleQuery("");
      setFocusedArticleId(null);
      setSelectedJurisprudenceLoading(true);
      const fetchDetail = async () => {
        try {
          const headers: Record<string, string> = { Accept: "application/json" };
          const token =
            typeof window !== "undefined"
              ? window.localStorage.getItem(TOKEN_KEY)
              : null;
          if (token) headers.Authorization = `Bearer ${token}`;
          const response = await fetch(
            `${VADE_JURIS_API_URL}?nomecodigo=${encodeURIComponent(trimmed)}`,
            { headers }
          );
          if (!response.ok) {
            throw new Error(`Falha ao carregar jurisprudencia (${response.status})`);
          }
          const payload = await response.json();
          const items = normalizeJurisprudenceRecords(payload).filter(
            (entry) => normalizeText(entry.nomecodigo) === normalizeText(trimmed)
          );
          setSelectedJurisprudenceItems(items);
        } catch (detailError) {
          setSelectedJurisprudenceError(
            detailError instanceof Error ? detailError.message : "Erro ao carregar jurisprudencia."
          );
        } finally {
          setSelectedJurisprudenceLoading(false);
        }
      };
      void fetchDetail();
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [isMobile, normalizeText]
  );

  const parseOrder = React.useCallback((value: string) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }, []);

  const parseArticleNumberValue = React.useCallback((value?: string | null) => {
    if (!value) return null;
    const digits = value.match(/\d+(?:[\.,]\d+)?/);
    if (!digits) return null;
    const parsed = Number(digits[0].replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
  }, []);

  const formatPair = React.useCallback((left: string, right: string) => {
    const leftValue = left?.trim();
    const rightValue = right?.trim();
    if (leftValue && rightValue) return `${leftValue} - ${rightValue}`;
    return leftValue || rightValue || "-";
  }, []);

  const tabs = React.useMemo(
    () => [
      { id: "constitution" as const, name: "Constituição", icon: Scale },
      { id: "codes" as const, name: "Códigos", icon: BookOpen },
      { id: "laws" as const, name: "Leis", icon: FileText },
      { id: "jurisprudence" as const, name: "Jurisprudência", icon: Gavel },
      { id: "oab" as const, name: "OAB", icon: Shield },
      { id: "statutes" as const, name: "Estatutos", icon: Users },
    ],
    []
  );

  const tabMatchesTipo = React.useCallback(
    (tabId: (typeof tabs)[number]["id"], tipo: string) => {
      const normalized = normalizeText(tipo);
      switch (tabId) {
        case "constitution":
          return ["constituicao", "constitution"].includes(normalized);
        case "codes":
          return ["codigos", "codigo", "codes", "code"].includes(normalized);
        case "laws":
          return ["leis", "lei", "laws", "law"].includes(normalized);
        case "jurisprudence":
          return ["jurisprudencia", "jurisprudence"].includes(normalized);
        case "oab":
          return normalized === "oab";
        case "statutes":
          return ["estatutos", "statutes"].includes(normalized);
        default:
          return false;
      }
    },
    [normalizeText, tabs]
  );

  const buildCardSections = React.useCallback(
    (group: Pick<VadeMecumGroup, "description">, groupCodes: VadeMecumCode[]) => {
      const records = [...groupCodes].sort((a, b) => {
        const aOrder = parseOrder(a.ordem);
        const bOrder = parseOrder(b.ordem);
        if (aOrder === null && bOrder === null) return 0;
        if (aOrder === null) return 1;
        if (bOrder === null) return -1;
        return aOrder - bOrder;
      });

      type ChapterSection = {
        key: string;
        livroLine: string;
        tituloLine: string;
        capituloLine: string;
        items: Array<{
          articleId: string;
          articleNumber: string;
          orderLabel: string;
          normativo: string;
        }>;
      };

      const sections: ChapterSection[] = [];
      const getChapterKey = (record: VadeMecumCode) =>
        [
          record.idcapitulo,
          record.capitulo,
          record.capitulotexto,
        ]
          .filter((value) => Boolean(value?.trim()))
          .join("|") ||
        [
          record.idtitulo,
          record.titulo,
          record.titulotexto,
          record.idlivro,
          record.livro,
          record.livrotexto,
        ]
          .filter((value) => Boolean(value?.trim()))
          .join("|") ||
        "chapter";

      records.forEach((record, index) => {
        const key = getChapterKey(record);
        const current = sections[sections.length - 1];
        const orderLabel = String(parseOrder(record.ordem) ?? index + 1);
        const articleNumber = record.num_artigo?.trim() || "";
        const normativo = record.normativo?.trim() || "-";
        const baseArticleId = record.id.trim();
        const articleId =
          baseArticleId.length > 0
            ? baseArticleId
            : `${record.nomecodigo || "article"}-${index}`;

        if (!current || current.key !== key) {
          sections.push({
            key,
            livroLine: formatPair(record.livro, record.livrotexto),
            tituloLine: formatPair(record.titulo, record.titulotexto),
            capituloLine: formatPair(record.capitulo, record.capitulotexto),
            items: [{ articleId, articleNumber, orderLabel, normativo }],
          });
          return;
        }

        current.items.push({ articleId, articleNumber, orderLabel, normativo });
      });

      const cabecalho =
        records.find((record) => record.cabecalho?.trim())?.cabecalho ||
        group.description ||
        "-";

      return {
        cabecalho,
        sections,
      };
    },
    [formatPair, parseOrder]
  );

  const groupedCodes = React.useMemo<VadeMecumGroup[]>(() => {
    const map = new Map<string, VadeMecumGroup>();
    codes.forEach((code) => {
      const tipo = code.tipo?.trim() || "Outros";
      const codigo = code.nomecodigo?.trim() || code.id;
      const key = `${tipo}::${codigo}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          tipo,
          label: code.nomecodigo || `Codigo ${codigo}`,
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
    if (!selectedGroupKey) return;
    if (isLawDetail) return;
    if (!groupedCodes.some((group) => group.key === selectedGroupKey)) {
      setSelectedGroupKey(null);
      setSelectedGroup(null);
      setSelectedGroupCodes([]);
    }
  }, [groupedCodes, isLawDetail, selectedGroupKey]);

  const groupsByTipo = React.useMemo(() => {
    const buckets = groupedCodes.reduce<Record<string, VadeMecumGroup[]>>(
      (accumulator, group) => {
        const tipo = group.tipo?.trim() || "Outros";
        if (!accumulator[tipo]) accumulator[tipo] = [];
        accumulator[tipo].push(group);
        return accumulator;
      },
      {}
    );

    return Object.entries(buckets)
      .map(([tipo, groups]) => ({
        tipo,
        groups: groups.sort((a, b) =>
          (a.label || "").localeCompare(b.label || "", "pt-BR")
        ),
      }))
      .sort((a, b) => a.tipo.localeCompare(b.tipo, "pt-BR"));
  }, [groupedCodes]);

  const visibleGroupsByTipo = React.useMemo(() => {
    if (activeTab === "codes") return groupsByTipo;
    return groupsByTipo.filter(({ tipo }) => tabMatchesTipo(activeTab, tipo));
  }, [activeTab, groupsByTipo, tabMatchesTipo]);

  React.useEffect(() => {
    if (loading) return;
    if (activeTab === "codes") return;
    const hasMatches = groupsByTipo.some(({ tipo }) => tabMatchesTipo(activeTab, tipo));
    if (hasMatches) return;

    const firstAvailable = tabs.find((tab) =>
      groupsByTipo.some(({ tipo }) => tabMatchesTipo(tab.id, tipo))
    );
    if (firstAvailable) setActiveTab(firstAvailable.id);
  }, [activeTab, groupsByTipo, loading, tabMatchesTipo, tabs]);

  const fetchCodesForNomecodigo = React.useCallback(
    async (nomecodigo: string) => {
      const trimmedName = nomecodigo?.trim();
      if (!trimmedName) return;
      setSelectedLoading(true);
      setSelectedError(null);
      try {
        const headers: Record<string, string> = { Accept: "application/json" };
        const token =
          typeof window !== "undefined"
            ? window.localStorage.getItem(TOKEN_KEY)
            : null;
        if (token) headers.Authorization = `Bearer ${token}`;

        const url = `${VADE_CODIGOS_API_URL}?nomecodigo=${encodeURIComponent(
          trimmedName
        )}`;
        let response = await fetch(url, { headers });
        if ((response.status === 401 || response.status === 403) && token) {
          response = await fetch(url, { headers: { Accept: "application/json" } });
        }
        if (!response.ok) {
          throw new Error(`Falha ao carregar detalhes (${response.status})`);
        }
        const payload = await response.json();
        const loaded = normalizeCollection(payload);
        const normalizedNomecodigo = normalizeText(trimmedName);
        const matching = loaded.filter(
          (code) => normalizeText(code.nomecodigo) === normalizedNomecodigo
        );
        setSelectedGroupCodes(matching);
      } catch (detailError) {
        setSelectedError(
          detailError instanceof Error
            ? detailError.message
            : "Erro ao carregar detalhes."
        );
      } finally {
        setSelectedLoading(false);
      }
    },
    [normalizeText]
  );

  const openGroup = (groupKey: string) => {
    const group = groupedCodes.find((entry) => entry.key === groupKey) || null;
    if (!group) return;

    setSelectedGroupKey(group.key);
    setSelectedGroup(group);
    setSelectedGroupCodes(group.codes);
    setSelectedLawDetail(null);
    setArticleQuery("");
    setFocusedArticleId(null);
    setSelectedJurisprudenceName(null);
    setSelectedJurisprudenceItems([]);
    setSelectedJurisprudenceError(null);
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const nomecodigo =
      group.codes.find((code) => code.nomecodigo?.trim())?.nomecodigo ||
      group.label;
    if (!nomecodigo?.trim()) return;

    void fetchCodesForNomecodigo(nomecodigo);
  };

  const loadLawDetail = React.useCallback(
    async (nomecodigo: string, fallbackTitulo?: string) => {
      const trimmed = nomecodigo?.trim();
      if (!trimmed) return;
      setSelectedLoading(true);
      setSelectedError(null);
      setSelectedLawDetail(null);
      try {
        const headers: Record<string, string> = { Accept: "application/json" };
        const token =
          typeof window !== "undefined"
            ? window.localStorage.getItem(TOKEN_KEY)
            : null;
        if (token) headers.Authorization = `Bearer ${token}`;
        const response = await fetch(
          `${VADE_LAWS_API_URL}?nomecodigo=${encodeURIComponent(trimmed)}`,
          { headers }
        );
        if (!response.ok) {
          throw new Error(`Falha ao carregar leis (${response.status})`);
        }
        const payload = await response.json();
        const records = normalizeLawDetailRecords(payload);
        const normalizedNomecodigo = normalizeText(trimmed);
        const matches = records.filter(
          (record) =>
            normalizeText(record.nomecodigo) === normalizedNomecodigo &&
            Boolean(record.texto)
        );
        const fallbackMatches = records.filter((record) => Boolean(record.texto));
        const effectiveRecords =
          matches.length > 0
            ? matches
            : fallbackMatches.length > 0
            ? fallbackMatches
            : records;
        if (effectiveRecords.length === 0) {
          throw new Error("Lei não encontrada para o código informado.");
        }
        const detail = effectiveRecords[0];
        const artigos = effectiveRecords.map((record, index) => ({
          id: record.id || `law-article-${index}`,
          numero: record.numero,
          texto: record.texto || "-",
        }));
        setSelectedLawDetail({
          tipo: detail.tipo,
          nomecodigo: detail.nomecodigo || trimmed,
          titulo: detail.titulo || fallbackTitulo || "",
          artigos,
        });
      } catch (detailError) {
        setSelectedError(
          detailError instanceof Error
            ? detailError.message
            : "Erro ao carregar leis."
        );
      } finally {
        setSelectedLoading(false);
      }
    },
    [normalizeText]
  );

  const openLawGroup = React.useCallback(
    (groupData: VadeMecumLawGroup) => {
      const trimmed = groupData?.nomecodigo?.trim();
      if (!trimmed) return;
      const normalized = normalizeText(trimmed);
      const baseKey = groupData?.id
        ? `law-${groupData.id}`
        : `law-${normalized}`;
      const baseGroup: VadeMecumGroup = {
        key: baseKey,
        tipo: "Leis",
        label: trimmed,
        description: groupData?.descricao || trimmed,
        codes: [],
      };

      setLawError(null);
      setSelectedGroupKey(baseGroup.key);
      setSelectedGroup(baseGroup);
      setSelectedGroupCodes([]);
      setSelectedLawDetail(null);
      setSelectedError(null);
      setArticleQuery("");
      setFocusedArticleId(null);
      setSelectedJurisprudenceName(null);
      setSelectedJurisprudenceItems([]);
      setSelectedJurisprudenceError(null);
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      void loadLawDetail(trimmed, groupData?.descricao || trimmed);
    },
    [isMobile, loadLawDetail, normalizeText]
  );

  const resetDetail = () => {
    setSelectedGroupKey(null);
    setSelectedGroup(null);
    setSelectedGroupCodes([]);
    setSelectedError(null);
    setSelectedLawDetail(null);
    setArticleQuery("");
    setFocusedArticleId(null);
    setSelectedJurisprudenceName(null);
    setSelectedJurisprudenceItems([]);
    setSelectedJurisprudenceError(null);
    setSelectedJurisprudenceLoading(false);
  };

  const handleArticleSelect = React.useCallback(
    (articleId: string) => {
      setFocusedArticleId(articleId);
      if (typeof document !== "undefined") {
        const target = document.getElementById(`article-${articleId}`);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (isMobile) {
        setIsNavOpen(false);
      }
    },
    [isMobile]
  );

  const articleMetaMap = React.useMemo(() => {
    const map = new Map<
      string,
      { part: string; label: string; sortOrder: number }
    >();
    selectedGroupCodes.forEach((record, index) => {
      const part = record.parte?.trim() || "Sem parte definida";
      const articleNumber = record.num_artigo?.trim();
      const fallbackLabel = String(parseOrder(record.ordem) ?? index + 1);
      const baseArticleId = record.id.trim();
      const articleId =
        baseArticleId.length > 0
          ? baseArticleId
          : `${record.nomecodigo || "article"}-${index}`;
      const sortOrder =
        parseOrder(record.ordem) ??
        parseArticleNumberValue(articleNumber) ??
        index + 1;
      const label = articleNumber || fallbackLabel;
      map.set(articleId, { part, label, sortOrder });
    });
    return map;
  }, [parseArticleNumberValue, parseOrder, selectedGroupCodes]);

  const filterGroups = React.useMemo(() => {
    if (!selectedGroup) return [];
    const card = buildCardSections(selectedGroup, selectedGroupCodes);
    const flattened = card.sections.flatMap((section) => section.items);
    const groupMap = new Map<
      string,
      { part: string; items: Array<{ key: string; articleId: string; label: string; sortOrder: number }> }
    >();
    const seen = new Set<string>();

    flattened.forEach((item, index) => {
      if (seen.has(item.articleId)) return;
      seen.add(item.articleId);
      const meta =
        articleMetaMap.get(item.articleId) || {
          part: "Sem parte definida",
          label: item.articleNumber || item.orderLabel || String(index + 1),
          sortOrder:
            parseOrder(item.orderLabel) ??
            parseArticleNumberValue(item.articleNumber) ??
            index + 1,
        };
      const part = meta.part || "Sem parte definida";
      if (!groupMap.has(part)) {
        groupMap.set(part, { part, items: [] });
      }
      groupMap.get(part)!.items.push({
        key: `${part}-${item.articleId}`,
        articleId: item.articleId,
        label: meta.label,
        sortOrder: meta.sortOrder,
      });
    });

    return Array.from(groupMap.values())
      .map((group) => ({
        ...group,
        items: group.items.sort((a, b) => {
          if (a.sortOrder === b.sortOrder) {
            return a.label.localeCompare(b.label, "pt-BR");
          }
          return a.sortOrder - b.sortOrder;
        }),
      }))
      .sort((a, b) => a.part.localeCompare(b.part, "pt-BR"));
  }, [
    articleMetaMap,
    buildCardSections,
    parseArticleNumberValue,
    parseOrder,
    selectedGroup,
    selectedGroupCodes,
  ]);

  const filteredFilterGroups = React.useMemo(() => {
    const term = articleQuery.trim().toLowerCase();
    if (!term) return filterGroups;
    return filterGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.label.toLowerCase().includes(term)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [articleQuery, filterGroups]);

  const lawFilterGroups = React.useMemo(() => {
    if (!selectedLawDetail) return [];
    const items = selectedLawDetail.artigos.map((article, index) => {
      const rawNumber = article.numero?.trim();
      const label = rawNumber || String(index + 1);
      const sortOrder =
        parseArticleNumberValue(rawNumber) ??
        parseOrder(String(index + 1)) ??
        index + 1;
      const articleId = article.id || `law-article-${index}`;
      return { key: articleId, articleId, label, sortOrder };
    });
    return [
      {
        part: "Artigos",
        items: items.sort((a, b) => {
          if (a.sortOrder === b.sortOrder) {
            return a.label.localeCompare(b.label, "pt-BR");
          }
          return a.sortOrder - b.sortOrder;
        }),
      },
    ];
  }, [parseArticleNumberValue, parseOrder, selectedLawDetail]);

  const filteredLawFilterGroups = React.useMemo(() => {
    const term = articleQuery.trim().toLowerCase();
    const groups = lawFilterGroups;
    if (!term) return groups;
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.label.toLowerCase().includes(term)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [articleQuery, lawFilterGroups]);

  const jurisprudenceNavArticles = React.useMemo(() => {
    return selectedJurisprudenceItems
      .map((item, index) => ({
        key: `${item.id}-${index}`,
        articleId: item.id,
        label: item.num_artigo?.trim() || `Item ${index + 1}`,
        order:
          parseArticleNumberValue(item.num_artigo) ??
          parseOrder(String(index + 1)) ??
          index + 1,
      }))
      .sort((a, b) => {
        if (a.order === b.order) {
          return a.label.localeCompare(b.label, "pt-BR");
        }
        return a.order - b.order;
      });
  }, [parseArticleNumberValue, parseOrder, selectedJurisprudenceItems]);

  const filteredJurisprudenceNavArticles = React.useMemo(() => {
    const term = articleQuery.trim().toLowerCase();
    if (!term) return jurisprudenceNavArticles;
    return jurisprudenceNavArticles.filter((item) =>
      item.label.toLowerCase().includes(term)
    );
  }, [articleQuery, jurisprudenceNavArticles]);

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

      {!selectedGroupKey &&
        !(activeTab === "jurisprudence" && selectedJurisprudenceName) && (
        <>
          <TabsContainer>
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (isMobile) window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                type="button"
              >
                <tab.icon />
                {tab.name}
              </Tab>
            ))}
          </TabsContainer>
          {loading ? (
            <ItemList>
              {Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  style={{ height: 140, opacity: 0.4, borderStyle: "dashed" }}
                />
              ))}
            </ItemList>
          ) : groupedCodes.length === 0 ? (
            <EmptyState>
              <h3>Nenhum codigo encontrado</h3>
              <p>Ajuste os filtros ou tente novamente mais tarde.</p>
            </EmptyState>
          ) : activeTab === "jurisprudence" && !selectedJurisprudenceName ? (
            <div>
              <GroupSection>
                <GroupTitle>JurisprudÊncia</GroupTitle>
                {jurisprudenceError && <ErrorMessage>{jurisprudenceError}</ErrorMessage>}
                {jurisprudenceLoading ? (
                  <ItemList>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Card
                        key={`juris-skeleton-${index}`}
                        style={{ height: 140, opacity: 0.4, borderStyle: "dashed" }}
                      />
                    ))}
                  </ItemList>
                ) : jurisprudenceGroups.length === 0 ? (
                  <EmptyState>
                    <h3>Nenhuma jurisprudencia encontrada</h3>
                    <p>O endpoint de jurisprudencia nao retornou registros.</p>
                  </EmptyState>
                ) : (
                  <ItemList>
                    {jurisprudenceGroups.map((group) => (
                      <ItemCard
                        key={group.id}
                        onClick={() => openJurisprudenceGroup(group.nomecodigo)}
                      >
                        <h3>{group.nomecodigo || "Sem nome"}</h3>
                        <p>{group.descricao || "Sem descricao cadastrada."}</p>
                        {typeof group.quantidade === "number" && (
                          <span>{group.quantidade} registros</span>
                        )}
                      </ItemCard>
                    ))}
                  </ItemList>
                )}
              </GroupSection>
            </div>
          ) : activeTab === "laws" ? (
            <div>
              <GroupSection>
                <GroupTitle>Leis</GroupTitle>
                {lawError && <ErrorMessage>{lawError}</ErrorMessage>}
                {lawLoading ? (
                  <ItemList>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Card
                        key={`law-skeleton-${index}`}
                        style={{ height: 140, opacity: 0.4, borderStyle: "dashed" }}
                      />
                    ))}
                  </ItemList>
                ) : lawGroups.length === 0 ? (
                  <EmptyState>
                    <h3>Nenhuma lei encontrada</h3>
                    <p>O endpoint de leis nao retornou registros.</p>
                  </EmptyState>
                ) : (
                  <ItemList>
                    {lawGroups.map((group) => (
                      <ItemCard
                        key={group.id}
                        onClick={() => openLawGroup(group)}
                      >
                        <h3>{group.nomecodigo || "Sem nome"}</h3>
                        <p>{group.descricao || "Sem descricao cadastrada."}</p>
                        {typeof group.quantidade === "number" && (
                          <span>{group.quantidade} registros</span>
                        )}
                      </ItemCard>
                    ))}
                  </ItemList>
                )}
              </GroupSection>
            </div>
          ) : visibleGroupsByTipo.length === 0 ? (
            <EmptyState>
              <h3>Nenhum codigo encontrado</h3>
              <p>Nenhum registro encontrado para esta categoria.</p>
            </EmptyState>
          ) : (
            <div>
              {visibleGroupsByTipo.map(({ tipo, groups }) => (
                <GroupSection key={tipo}>
                  <GroupTitle>{tipo}</GroupTitle>
                  <ItemList>
                    {groups.map((group) => (
                      <ItemCard key={group.key} onClick={() => openGroup(group.key)}>
                        <h3>{group.label}</h3>
                        <p>{group.description || "Sem descricao cadastrada."}</p>
                      </ItemCard>
                    ))}
                  </ItemList>
                </GroupSection>
              ))}
            </div>
          )}
        </>
      )}

      {selectedGroupKey && selectedGroup && (
        <>
          <MobileNavButton onClick={() => setIsNavOpen(true)}>
            <Menu size={20} />
          </MobileNavButton>
          <MobileNavOverlay
            isOpen={isNavOpen}
            onClick={() => setIsNavOpen(false)}
          />
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
                  {!isLawDetail && (
                    <>
                      <h2 style={{ marginBottom: 8 }}>{selectedGroup.label}</h2>
                      <p style={{ color: "var(--text-secondary)" }}>
                        {selectedGroup.description || "Sem cabecalho cadastrado."}
                      </p>
                    </>
                  )}
                  {selectedError && (
                    <p style={{ marginTop: 12, color: "#dc2626", fontWeight: 600 }}>
                      {selectedError}
                    </p>
                  )}
                  {selectedLoading && (
                    <p style={{ marginTop: 12, color: "var(--text-secondary)" }}>
                      Carregando detalhes...
                    </p>
                  )}
                  {(() => {
                    if (isLawDetail) {
                      if (!selectedLawDetail && !selectedLoading && !selectedError) {
                        return (
                          <p style={{ marginTop: 16, color: "var(--text-secondary)" }}>
                            Nenhuma lei encontrada para este código.
                          </p>
                        );
                      }
                      const lawTipoText =
                        selectedLawDetail?.tipo?.trim() ||
                        selectedLawDetail?.nomecodigo?.trim() ||
                        selectedGroup.label ||
                        "Tipo não informado";
                      const lawTitulo =
                        selectedLawDetail?.titulo?.trim() ||
                        "Título não informado";
                      const artigos = selectedLawDetail?.artigos || [];
                      return (
                        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
                          <p style={{ fontWeight: 700 }}>{lawTipoText}</p>
                          <p style={{ fontWeight: 700 }}>{lawTitulo}</p>
                          <p style={{ fontWeight: 700 }}>Artigos</p>
                          <div style={{ display: "grid", gap: 8 }}>
                            {artigos.length === 0 && !selectedLoading ? (
                              <p style={{ color: "var(--text-secondary)" }}>
                                Nenhum artigo retornado pelo serviço.
                              </p>
                            ) : (
                              artigos.map((article, index) => {
                                const articleId = article.id || `law-article-${index}`;
                                const isFocused =
                                  focusedArticleId === articleId;
                                const content =
                                  article.texto?.trim() || "-";
                                return (
                                  <ArticleParagraph
                                    key={articleId}
                                    id={`article-${articleId}`}
                                    focused={isFocused}
                                  >
                                    {content}
                                  </ArticleParagraph>
                                );
                              })
                            )}
                          </div>
                        </div>
                      );
                    }

                    const card = buildCardSections(
                      selectedGroup,
                      selectedGroupCodes
                    );
                    return (
                      <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
                        {card.sections.map((section) => (
                          <div key={section.key}>
                            <p>{section.livroLine}</p>
                            <p>{section.tituloLine}</p>
                            <p>{section.capituloLine}</p>
                            <div style={{ display: "grid", gap: 8 }}>
                              {section.items.map((item, index) => {
                                const fallbackLabel = `Art. ${
                                  item.articleNumber || item.orderLabel
                                }`;
                                const parts = extractArticleParts(
                                  item.normativo,
                                  fallbackLabel
                                );
                                const isFocused =
                                  focusedArticleId === item.articleId;
                                return (
                                  <ArticleParagraph
                                    key={`${section.key}-${index}`}
                                    id={`article-${item.articleId}`}
                                    focused={isFocused}
                                  >
                                    <span className="article-prefix">
                                      {parts.label}
                                    </span>
                                    {parts.body}
                                  </ArticleParagraph>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </Card>
              </ArticleContent>
            </MainContent>

            <NavigationPanel isOpen={isNavOpen}>
              <CloseNavButton onClick={() => setIsNavOpen(false)}>
                <X size={16} />
              </CloseNavButton>
              <SearchContainer>
                <SearchField
                  type="text"
                  placeholder="Buscar artigo (ex: 1230 ou 1)"
                  value={articleQuery}
                  onChange={(event) => setArticleQuery(event.target.value)}
                />
                <SearchButton type="button" onClick={() => setArticleQuery("")}>
                  Limpar
                </SearchButton>
              </SearchContainer>
              <FilterGroupsContainer>
                {(isLawDetail
                  ? filteredLawFilterGroups
                  : filteredFilterGroups
                ).length === 0 ? (
                  <FilterEmptyState>
                    Nenhum artigo encontrado para o filtro.
                  </FilterEmptyState>
                ) : (
                  (isLawDetail
                    ? filteredLawFilterGroups
                    : filteredFilterGroups
                  ).map((group) => (
                    <div key={group.part}>
                      <FilterGroupTitle>{group.part}</FilterGroupTitle>
                      <FilterGroupGrid>
                        {group.items.map((item) => (
                          <ArticleButton
                            key={item.key}
                            type="button"
                            active={focusedArticleId === item.articleId}
                            onClick={() => handleArticleSelect(item.articleId)}
                          >
                            Art. {item.label || "-"}
                          </ArticleButton>
                        ))}
                      </FilterGroupGrid>
                    </div>
                  ))
                )}
              </FilterGroupsContainer>
            </NavigationPanel>
          </ContentArea>
        </>
      )}

      {!selectedGroupKey && selectedJurisprudenceName && (
        <>
          <MobileNavButton onClick={() => setIsNavOpen(true)}>
            <Menu size={20} />
          </MobileNavButton>
          <MobileNavOverlay
            isOpen={isNavOpen}
            onClick={() => setIsNavOpen(false)}
          />
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
                  <h2 style={{ marginBottom: 8 }}>{selectedJurisprudenceName}</h2>
                  <p style={{ color: "var(--text-secondary)" }}>
                    Seleção de enunciados e súmulas vinculadas ao código informado.
                  </p>
                  {selectedJurisprudenceError && (
                    <p style={{ marginTop: 12, color: "#dc2626", fontWeight: 600 }}>
                      {selectedJurisprudenceError}
                    </p>
                  )}
                  {selectedJurisprudenceLoading && (
                    <p style={{ marginTop: 12, color: "var(--text-secondary)" }}>
                      Carregando jurisprudência...
                    </p>
                  )}
                  {!selectedJurisprudenceLoading && selectedJurisprudenceItems.length === 0 && (
                    <p style={{ marginTop: 12, color: "var(--text-secondary)" }}>
                      Nenhum registro relacionado encontrado.
                    </p>
                  )}
                  {!selectedJurisprudenceLoading && selectedJurisprudenceItems.length > 0 && (
                    <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
                      {selectedJurisprudenceItems.map((item, index) => {
                        const prefix = item.num_artigo?.trim()
                          ? `Art. ${item.num_artigo.trim()}`
                          : `Item ${index + 1}`;
                        const isFocused = focusedArticleId === item.id;
                        return (
                          <ArticleParagraph
                            key={`${item.id}-${index}`}
                            id={`article-${item.id}`}
                            focused={isFocused}
                          >
                            <span className="article-prefix">{prefix}</span>
                            {item.enunciado || item.normativo || item.cabecalho || "Sem descrição."}
                          </ArticleParagraph>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </ArticleContent>
            </MainContent>

            <NavigationPanel isOpen={isNavOpen}>
              <CloseNavButton onClick={() => setIsNavOpen(false)}>
                <X size={16} />
              </CloseNavButton>
              <SearchContainer>
                <SearchField
                  type="text"
                  placeholder="Buscar artigo (ex: 1230 ou 1)"
                  value={articleQuery}
                  onChange={(event) => setArticleQuery(event.target.value)}
                />
                <SearchButton type="button" onClick={() => setArticleQuery("")}>
                  Limpar
                </SearchButton>
              </SearchContainer>
              <FilterGroupsContainer>
                {filteredJurisprudenceNavArticles.length === 0 ? (
                  <FilterEmptyState>
                    Nenhum artigo encontrado para o filtro.
                  </FilterEmptyState>
                ) : (
                  <FilterGroupGrid>
                    {filteredJurisprudenceNavArticles.map((item) => (
                      <ArticleButton
                        key={item.key}
                        type="button"
                        active={focusedArticleId === item.articleId}
                        onClick={() => handleArticleSelect(item.articleId)}
                      >
                        {item.label}
                      </ArticleButton>
                    ))}
                  </FilterGroupGrid>
                )}
              </FilterGroupsContainer>
            </NavigationPanel>
          </ContentArea>
        </>
      )}
    </VadeMecumContainer>
  );
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const getString = (record: UnknownRecord, key: string) => {
  const value = record[key];
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
};

const getFirstString = (record: UnknownRecord, keys: string[], fallback = "") => {
  for (const key of keys) {
    const value = getString(record, key);
    if (value) return value;
  }
  return fallback;
};

const normalizeRecord = (item: unknown, index: number): VadeMecumCode => {
  const record: UnknownRecord = isRecord(item) ? item : {};
  return {
    id: getFirstString(record, ["id", "uuid"], String(index)),
    tipo: getFirstString(record, ["tipo", "Tipo"]),
    nomecodigo: getFirstString(
      record,
      ["nomecodigo", "titulo"],
      `Codigo ${index + 1}`
    ),
    cabecalho: getFirstString(record, ["cabecalho", "Cabecalho"]),
    parte: getFirstString(record, ["parte", "PARTE"]),
    idlivro: getString(record, "idlivro"),
    livro: getString(record, "livro"),
    livrotexto: getString(record, "livrotexto"),
    idtitulo: getString(record, "idtitulo"),
    titulo: getString(record, "titulo"),
    titulotexto: getString(record, "titulotexto"),
    idsubtitulo: getString(record, "idsubtitulo"),
    subtitulo: getString(record, "subtitulo"),
    subtitulotexto: getString(record, "subtitulotexto"),
    idcapitulo: getString(record, "idcapitulo"),
    capitulo: getString(record, "capitulo"),
    capitulotexto: getString(record, "capitulotexto"),
    idsecao: getString(record, "idsecao"),
    secao: getString(record, "secao"),
    secaotexto: getString(record, "secaotexto"),
    idsubsecao: getString(record, "idsubsecao"),
    subsecao: getString(record, "subsecao"),
    subsecaotexto: getString(record, "subsecaotexto"),
    num_artigo: getString(record, "num_artigo"),
    normativo: getFirstString(record, ["Normativo", "normativo"]),
    ordem: getFirstString(record, ["Ordem", "ordem"]),
    updatedAt: getFirstString(record, [
      "updated_at",
      "updatedAt",
      "atualizado_em",
      "created_at",
    ]),
    createdAt: getFirstString(record, ["created_at", "createdAt"]),
  };
};

const normalizeCollection = (payload: unknown): VadeMecumCode[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload.map((item, index) => normalizeRecord(item, index));
  }
  if (!isRecord(payload)) return [];

  const itemsCandidate = payload["items"];
  if (Array.isArray(itemsCandidate)) {
    return itemsCandidate.map((item, index) => normalizeRecord(item, index));
  }

  const dataCandidate = payload["data"];
  if (Array.isArray(dataCandidate)) {
    return dataCandidate.map((item, index) => normalizeRecord(item, index));
  }

  return [];
};

const normalizeJurisprudenceRecords = (payload: unknown): VadeMecumJurisprudence[] => {
  const parseItem = (item: unknown, index: number): VadeMecumJurisprudence => {
    if (!item || typeof item !== "object") {
      return {
        id: `juris-record-${index}`,
        nomecodigo: `Jurisprudência ${index + 1}`,
        normativo: "",
        enunciado: "",
        num_artigo: "",
        cabecalho: "",
      };
    }
    const record = item as Record<string, unknown>;
    const nomecodigo = getFirstString(record, ["nomecodigo", "nomeCodigo"], `Jurisprudência ${index + 1}`);
    const id = getFirstString(record, ["id"], `${nomecodigo}-${index}`);
    const normativo = getFirstString(record, ["Normativo", "normativo", "descricao"], "");
    const enunciado = getFirstString(record, ["Enunciado", "enunciado"], "");
    const numArtigo = getFirstString(record, ["num_artigo", "numeroArtigo", "NumeroArtigo"], "");
    const cabecalho = getFirstString(record, ["Cabecalho", "cabecalho"], "");
    const ramo = getFirstString(record, ["ramotexto", "ramoTexto", "RamoTexto"]);
    const assunto = getFirstString(record, ["assuntotexto", "AssuntoTexto", "assuntoTexto"]);
    return {
      id,
      nomecodigo,
      normativo,
      enunciado,
      num_artigo: numArtigo,
      cabecalho,
      ramo,
      assunto,
    };
  };

  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload.map(parseItem);
  }
  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record["items"])) {
      return record["items"].map(parseItem);
    }
    if (Array.isArray(record["data"])) {
      return record["data"].map(parseItem);
    }
  }
  return [];
};

const normalizeJurisprudenceGroups = (payload: unknown): VadeMecumJurisprudenceGroup[] => {
  const parseRaw = (item: unknown, index: number): VadeMecumJurisprudenceGroup => {
    if (!item || typeof item !== "object") {
      return {
        id: `juris-${index}`,
        nomecodigo: `Jurisprudencia ${index + 1}`,
      };
    }
    const record = item as Record<string, unknown>;
    const nomecodigo =
      typeof record["nomecodigo"] === "string"
        ? record["nomecodigo"]
        : typeof record["nomeCodigo"] === "string"
        ? record["nomeCodigo"]
        : typeof record["cabecalho"] === "string"
        ? record["cabecalho"]
        : typeof record["Cabecalho"] === "string"
        ? record["Cabecalho"]
        : `Jurisprudencia ${index + 1}`;
    const quantidadeValue = record["quantidade"] ?? record["total"] ?? record["count"];
    const quantidade =
      typeof quantidadeValue === "number"
        ? quantidadeValue
        : typeof quantidadeValue === "string"
        ? Number(quantidadeValue)
        : undefined;
    const descricaoRaw =
      typeof record["descricao"] === "string"
        ? record["descricao"]
        : typeof record["description"] === "string"
        ? record["description"]
        : typeof record["cabecalho"] === "string"
        ? record["cabecalho"]
        : typeof record["Cabecalho"] === "string"
        ? record["Cabecalho"]
        : undefined;
    const descricao = descricaoRaw && descricaoRaw !== nomecodigo ? descricaoRaw : undefined;
    const id =
      typeof record["id"] === "string"
        ? record["id"]
        : `juris-${nomecodigo}-${index}`;
    return { id, nomecodigo, descricao, quantidade };
  };

  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload.map(parseRaw);
  }
  if (typeof payload === "object") {
    const raw = payload as Record<string, unknown>;
    if (Array.isArray(raw["items"])) {
      return raw["items"].map(parseRaw);
    }
    if (Array.isArray(raw["data"])) {
      return raw["data"].map(parseRaw);
    }
  }
  return [];
};

const normalizeLawGroups = (payload: unknown): VadeMecumLawGroup[] => {
  const parseRaw = (item: unknown, index: number): VadeMecumLawGroup => {
    if (!item || typeof item !== "object") {
      return {
        id: `law-${index}`,
        nomecodigo: `Lei ${index + 1}`,
      };
    }
    const record = item as Record<string, unknown>;
    const nomecodigo =
      typeof record["nomecodigo"] === "string"
        ? record["nomecodigo"]
        : typeof record["nomeCodigo"] === "string"
        ? record["nomeCodigo"]
        : typeof record["cabecalho"] === "string"
        ? record["cabecalho"]
        : `Lei ${index + 1}`;
    const descricao =
      typeof record["descricao"] === "string"
        ? record["descricao"]
        : typeof record["description"] === "string"
        ? record["description"]
        : typeof record["cabecalho"] === "string"
        ? record["cabecalho"]
        : undefined;
    const quantidadeValue = record["quantidade"];
    const quantidade =
      typeof quantidadeValue === "number"
        ? quantidadeValue
        : typeof quantidadeValue === "string"
        ? Number(quantidadeValue)
        : undefined;
    const id =
      typeof record["id"] === "string"
        ? record["id"]
        : `law-${nomecodigo}-${index}`;
    return { id, nomecodigo, descricao, quantidade };
  };

  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload.map(parseRaw);
  }
  if (typeof payload === "object") {
    const raw = payload as Record<string, unknown>;
    if (Array.isArray(raw["items"])) {
      return raw["items"].map(parseRaw);
    }
    if (Array.isArray(raw["data"])) {
      return raw["data"].map(parseRaw);
    }
  }
  return [];
};

type NormalizedLawRecord = {
  id: string;
  tipo?: string;
  nomecodigo: string;
  titulo?: string;
  numero?: string;
  texto: string;
};

const normalizeLawDetailRecords = (payload: unknown): NormalizedLawRecord[] => {
  const parseRecord = (item: unknown, index: number): NormalizedLawRecord => {
    if (!item || typeof item !== "object") {
      return {
        id: `law-record-${index}`,
        nomecodigo: `Lei ${index + 1}`,
        texto: "",
      };
    }
    const record = item as Record<string, unknown>;
    return {
      id: getFirstString(record, ["id", "uuid"], `law-record-${index}`),
      tipo: getFirstString(record, ["tipo", "Tipo"]),
      nomecodigo: getFirstString(
        record,
        ["nomecodigo", "nomeCodigo", "nome", "nomeLei", "codigo"],
        `Lei ${index + 1}`
      ),
      titulo: getFirstString(
        record,
        ["titulo", "Titulo", "titulotexto", "TituloTexto"]
      ),
      numero: getFirstString(
        record,
        ["num_artigo", "numero_artigo", "numero", "Artigo", "artigo"]
      ),
      texto: getFirstString(
        record,
        ["artigos", "Artigos", "texto", "normativo", "descricao", "descricao_artigo", "conteudo", "cabecalho"],
        ""
      ),
    };
  };

  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload.map(parseRecord);
  }
  if (typeof payload === "object") {
    const raw = payload as Record<string, unknown>;
    if (Array.isArray(raw["items"])) {
      return raw["items"].map(parseRecord);
    }
    if (Array.isArray(raw["data"])) {
      return raw["data"].map(parseRecord);
    }
  }
  return [];
};

const extractArticleParts = (
  normativo: string,
  fallbackLabel: string
): { label: string; body: string } => {
  const text = (normativo ?? "").trimStart();
  const match = text.match(/^(Art(?:igo)?\.?\s*\d+[^\s]*)/i);
  if (match) {
    const label = match[0].trim();
    const body = text.slice(match[0].length).trimStart();
    return { label, body };
  }
  return {
    label: fallbackLabel,
    body: text,
  };
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
