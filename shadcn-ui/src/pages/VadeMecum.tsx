import React from "react";
import { buildApiUrl } from "@/lib/api";
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
  idcodigo?: string;
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
  ramotexto?: string;
  assuntotexto?: string;
  enunciado?: string;
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

type ArticleNavItem = {
  articleId: string;
  label: string;
  order: number | null;
};

type ArticleNavGroup = {
  key: string;
  label: string;
  order: number | null;
  priority: number;
  items: ArticleNavItem[];
};

const TOKEN_KEY = "pantheon:token";
const VADE_API_URL = buildApiUrl("/vade-mecum/codigos");
const VADE_LAWS_URL = buildApiUrl("/vade-mecum/leis");
const VADE_LAWS_GROUPED_URL = buildApiUrl("/vade-mecum/leis/gruposervico");
const VADE_OAB_URL = buildApiUrl("/vade-mecum/oab");
const VADE_OAB_CAPAS_URL = buildApiUrl("/vade-mecum/oab/capas");
const VADE_JURIS_URL = buildApiUrl("/vade-mecum/jurisprudencia");
const VADE_JURIS_GROUPED_URL = buildApiUrl("/vade-mecum/jurisprudencia/grouped");
const VADE_STATUTES_URL = buildApiUrl("/vade-mecum/estatutos/gruposervico");
const VADE_STATUTES_DETAIL_URL = buildApiUrl("/vade-mecum/estatutos");
const VADE_CONSTITUTION_URL = buildApiUrl("/vade-mecum/constituicao/gruposervico");
const VADE_CONSTITUTION_DETAIL_URL = buildApiUrl("/vade-mecum/constituicao");

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
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${(props) => `${props.theme.colors.accent}55`}
    ${(props) => `${props.theme.colors.surface}00`};

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
    max-height: none;
    overflow-y: auto;
    background: ${(props) => props.theme.colors.surface};
  }

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => `${props.theme.colors.surface}33`};
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.accent};
    border-radius: 999px;
    border: 2px solid ${(props) => props.theme.colors.surface};
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

const BackToListButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${(props) => `${props.theme.colors.accentSecondary}15`};
    color: ${(props) => props.theme.colors.accentSecondary};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${(props) => `${props.theme.colors.accentSecondary}55`};
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

const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

const ArticleGroupsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ArticleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ArticleGroupTitle = styled.h4`
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${(props) => props.theme.colors.textSecondary};
  letter-spacing: 0.08em;
`;

const ArticleButton = styled.button`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid ${(props) => props.theme.colors.border};
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.accentSecondary};
  }
`;

const ItemList = styled.div<{ singleColumn?: boolean }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.singleColumn ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))"};
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
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  .article-label {
    font-weight: 700;
    color: #7b1e1e;
    margin-right: 6px;
  }

  .article-body {
    color: ${(props) => props.theme.colors.textSecondary};
  }

  .article-part-label {
    font-weight: 700;
    color: ${(props) => props.theme.colors.text};
  }

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

  .article-highlight {
    background: ${(props) => `${props.theme.colors.accent}14`};
    border-radius: 10px;
    padding: 12px;
    transition: background 0.3s ease;
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
  const [laws, setLaws] = React.useState<VadeMecumCode[]>([]);
  const [lawsLoading, setLawsLoading] = React.useState(false);
  const [lawsError, setLawsError] = React.useState<string | null>(null);
  const [hasLoadedLaws, setHasLoadedLaws] = React.useState(false);
  const [oabRecords, setOabRecords] = React.useState<VadeMecumCode[]>([]);
  const [oabLoading, setOabLoading] = React.useState(false);
  const [oabError, setOabError] = React.useState<string | null>(null);
  const [hasLoadedOab, setHasLoadedOab] = React.useState(false);
  const [jurisRecords, setJurisRecords] = React.useState<VadeMecumCode[]>([]);
  const [jurisLoading, setJurisLoading] = React.useState(false);
  const [jurisError, setJurisError] = React.useState<string | null>(null);
  const [hasLoadedJuris, setHasLoadedJuris] = React.useState(false);
  const [constitutionRecords, setConstitutionRecords] = React.useState<VadeMecumCode[]>(
    []
  );
  const [constitutionLoading, setConstitutionLoading] = React.useState(false);
  const [constitutionError, setConstitutionError] = React.useState<string | null>(null);
  const [hasLoadedConstitution, setHasLoadedConstitution] = React.useState(false);
  const [statuteRecords, setStatuteRecords] = React.useState<VadeMecumCode[]>([]);
  const [statutesLoading, setStatutesLoading] = React.useState(false);
  const [statutesError, setStatutesError] = React.useState<string | null>(null);
  const [hasLoadedStatutes, setHasLoadedStatutes] = React.useState(false);
  const [selectedGroupKey, setSelectedGroupKey] = React.useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = React.useState<VadeMecumGroup | null>(null);
  const [selectedGroupCodes, setSelectedGroupCodes] = React.useState<VadeMecumCode[]>([]);
  const [selectedSource, setSelectedSource] = React.useState<
    "codes" | "laws" | "oab" | "jurisprudence" | "statutes" | "constitution"
  >("codes");
  const [selectedLoading, setSelectedLoading] = React.useState(false);
  const [selectedError, setSelectedError] = React.useState<string | null>(null);
  const [articleQuery, setArticleQuery] = React.useState("");
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<
    "constitution" | "codes" | "laws" | "jurisprudence" | "oab" | "statutes"
  >("codes");
  const [highlightedArticleId, setHighlightedArticleId] = React.useState<
    string | null
  >(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const highlightTimerRef = React.useRef<number | null>(null);

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

  const loadLaws = React.useCallback(async () => {
    setLawsLoading(true);
    setLawsError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token =
        typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(VADE_LAWS_GROUPED_URL, { headers });
      if (!response.ok) {
        throw new Error(`Falha ao carregar leis (${response.status})`);
      }
      const payload = await response.json();
      setLaws(normalizeLawsGroupCollection(payload));
      setHasLoadedLaws(true);
    } catch (requestError) {
      setLawsError(
        requestError instanceof Error ? requestError.message : "Erro ao carregar leis."
      );
    } finally {
      setLawsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeTab !== "laws") return;
    if (hasLoadedLaws || lawsLoading) return;
    void loadLaws();
  }, [activeTab, hasLoadedLaws, lawsLoading, loadLaws]);

  const loadOab = React.useCallback(async () => {
    setOabLoading(true);
    setOabError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token =
        typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(VADE_OAB_CAPAS_URL, { headers });
      if (!response.ok) {
        throw new Error(`Falha ao carregar OAB (${response.status})`);
      }
      const payload = await response.json();
      setOabRecords(normalizeOabCapaCollection(payload));
      setHasLoadedOab(true);
    } catch (requestError) {
      setOabError(
        requestError instanceof Error ? requestError.message : "Erro ao carregar OAB."
      );
    } finally {
      setOabLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeTab !== "oab") return;
    if (hasLoadedOab || oabLoading) return;
    void loadOab();
  }, [activeTab, hasLoadedOab, loadOab, oabLoading]);

  const loadJuris = React.useCallback(async () => {
    setJurisLoading(true);
    setJurisError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token =
        typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(VADE_JURIS_GROUPED_URL, { headers });
      if (!response.ok) {
        throw new Error(`Falha ao carregar jurisprudência (${response.status})`);
      }
      const payload = await response.json();
      setJurisRecords(normalizeJurisGroupCollection(payload));
      setHasLoadedJuris(true);
    } catch (requestError) {
      setJurisError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar jurisprudência."
      );
    } finally {
      setJurisLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeTab !== "jurisprudence") return;
    if (hasLoadedJuris || jurisLoading) return;
    void loadJuris();
  }, [activeTab, hasLoadedJuris, jurisLoading, loadJuris]);

  const loadConstitution = React.useCallback(async () => {
    setConstitutionLoading(true);
    setConstitutionError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token =
        typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(VADE_CONSTITUTION_URL, { headers });
      if (!response.ok) {
        throw new Error(`Falha ao carregar constituicao (${response.status})`);
      }
      const payload = await response.json();
      setConstitutionRecords(normalizeCollection(payload));
      setHasLoadedConstitution(true);
    } catch (requestError) {
      setConstitutionError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar constituicao."
      );
    } finally {
      setConstitutionLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeTab !== "constitution") return;
    if (hasLoadedConstitution || constitutionLoading) return;
    void loadConstitution();
  }, [activeTab, constitutionLoading, hasLoadedConstitution, loadConstitution]);

  const loadStatutes = React.useCallback(async () => {
    setStatutesLoading(true);
    setStatutesError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token =
        typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(VADE_STATUTES_URL, { headers });
      if (!response.ok) {
        throw new Error(`Falha ao carregar estatutos (${response.status})`);
      }
      const payload = await response.json();
      setStatuteRecords(normalizeCollection(payload));
      setHasLoadedStatutes(true);
    } catch (requestError) {
      setStatutesError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar estatutos."
      );
    } finally {
      setStatutesLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeTab !== "statutes") return;
    if (hasLoadedStatutes || statutesLoading) return;
    void loadStatutes();
  }, [activeTab, hasLoadedStatutes, loadStatutes, statutesLoading]);

  const parseOrder = React.useCallback((value: string) => {
    const trimmed = value?.trim();
    if (!trimmed) return null;
    const direct = Number(trimmed);
    if (Number.isFinite(direct)) return direct;
    const digits = trimmed.match(/\d+/);
    if (digits) {
      const fallback = Number(digits[0]);
      if (Number.isFinite(fallback)) return fallback;
    }
    return null;
  }, []);

  const extractArticleNumber = React.useCallback((record: VadeMecumCode) => {
    const direct = record.num_artigo?.trim();
    if (direct) return direct;
    const candidates = [record.ordem, record.normativo];
    for (const candidate of candidates) {
      const value = candidate?.trim();
      if (!value) continue;
      const match = value.match(/\d+/);
      if (match?.[0]) return match[0];
    }
    return "";
  }, []);

  const extractArticleLabel = React.useCallback((record: VadeMecumCode) => {
    const direct = record.num_artigo?.trim();
    if (direct) return direct;
    const normativo = record.normativo?.trim() || "";
    const match = normativo.match(/Art\.?\s*\d+[^\s]*/i);
    if (match?.[0]) return match[0].trim();
    const ordem = record.ordem?.trim();
    if (ordem) return ordem;
    return "";
  }, []);

  const formatPair = React.useCallback((left: string, right: string) => {
    const leftValue = left?.trim();
    const rightValue = right?.trim();
    if (leftValue && rightValue) return `${leftValue} - ${rightValue}`;
    return leftValue || rightValue || "-";
  }, []);

  const getPartePriority = React.useCallback((label: string) => {
    const normalized = label
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
    if (!normalized) return 2;
    if (normalized.includes("geral")) return 0;
    if (normalized.includes("especial")) return 1;
    return 2;
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

  const normalizeText = React.useCallback((value: string) => {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }, []);

  const hiddenDescriptions = React.useMemo(() => {
    return new Set(
      ["Ordenado por numero"].map((text) => normalizeText(text))
    );
  }, [normalizeText]);

  const sanitizeGroupDescription = React.useCallback(
    (text: string | undefined | null) => {
      const value = text?.trim() ?? "";
      if (!value) return "";
      const normalized = normalizeText(value);
      if (hiddenDescriptions.has(normalized)) return "";
      return value;
    },
    [hiddenDescriptions, normalizeText]
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

  const splitArticleHighlight = React.useCallback((text: string | undefined | null) => {
    const value = typeof text === "string" ? text : "";
    const withNumberMatch =
      value.match(/Art\.?\s*\d+[^\s]*/i) ?? value.match(/Art\.?/i);
    if (!withNumberMatch || withNumberMatch.index === undefined) {
      return { before: value, art: "", after: "" };
    }
    const before = value.slice(0, withNumberMatch.index);
    const art = withNumberMatch[0];
    const after = value.slice(withNumberMatch.index + art.length);
    return { before, art, after };
  }, []);

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
        parteLine: string;
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
        const articleId = record.id;

        if (!current || current.key !== key) {
          sections.push({
            key,
            livroLine: formatPair(record.livro, record.livrotexto),
            tituloLine: formatPair(record.titulo, record.titulotexto),
            capituloLine: formatPair(record.capitulo, record.capitulotexto),
            parteLine: record.parte?.trim() || "",
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

  const groupEntries = React.useCallback(
    (
      entries: VadeMecumCode[],
      options?: { groupByCabecalho?: boolean }
    ) => {
      const map = new Map<string, VadeMecumGroup>();
      entries.forEach((code) => {
        const tipo = code.tipo?.trim() || "Outros";
        const cabecalho = code.cabecalho?.trim() || "";
        const codigo = code.nomecodigo?.trim() || code.id;
        const key = options?.groupByCabecalho
          ? `${tipo}::${cabecalho || codigo}`
          : `${tipo}::${codigo}`;
        if (!map.has(key)) {
          map.set(key, {
            key,
            tipo,
            label: options?.groupByCabecalho
              ? cabecalho || code.nomecodigo || `Registro ${codigo}`
              : code.nomecodigo || `Codigo ${codigo}`,
            description: options?.groupByCabecalho
              ? code.nomecodigo || cabecalho || ""
              : code.cabecalho || "",
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
    },
    []
  );

  const groupedCodes = React.useMemo(
    () => groupEntries(codes),
    [codes, groupEntries]
  );
  const groupedLaws = React.useMemo(
    () => groupEntries(laws),
    [groupEntries, laws]
  );
  const groupedOab = React.useMemo(
    () => groupEntries(oabRecords),
    [groupEntries, oabRecords]
  );
  const groupedJuris = React.useMemo(
    () => groupEntries(jurisRecords, { groupByCabecalho: true }),
    [groupEntries, jurisRecords]
  );
  const groupedConstitution = React.useMemo(
    () => groupEntries(constitutionRecords),
    [constitutionRecords, groupEntries]
  );
  const groupedStatutes = React.useMemo(
    () => groupEntries(statuteRecords),
    [groupEntries, statuteRecords]
  );

  React.useEffect(() => {
    if (!selectedGroupKey) return;
    const source =
      selectedSource === "laws"
        ? groupedLaws
        : selectedSource === "oab"
          ? groupedOab
          : selectedSource === "jurisprudence"
            ? groupedJuris
            : selectedSource === "statutes"
              ? groupedStatutes
              : selectedSource === "constitution"
                ? groupedConstitution
                : groupedCodes;
    if (!source.some((group) => group.key === selectedGroupKey)) {
      setSelectedGroupKey(null);
      setSelectedGroup(null);
      setSelectedGroupCodes([]);
      setSelectedSource("codes");
    }
  }, [
    groupedCodes,
    groupedJuris,
    groupedLaws,
    groupedOab,
    groupedConstitution,
    groupedStatutes,
    selectedGroupKey,
    selectedSource,
  ]);

  const organizeByTipo = React.useCallback((collection: VadeMecumGroup[]) => {
    const buckets = collection.reduce<Record<string, VadeMecumGroup[]>>(
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
  }, []);

  const groupsByTipoCodes = React.useMemo(
    () => organizeByTipo(groupedCodes),
    [groupedCodes, organizeByTipo]
  );
  const groupsByTipoLaws = React.useMemo(
    () => organizeByTipo(groupedLaws),
    [groupedLaws, organizeByTipo]
  );
  const groupsByTipoOab = React.useMemo(
    () => organizeByTipo(groupedOab),
    [groupedOab, organizeByTipo]
  );
  const groupsByTipoJuris = React.useMemo(
    () => organizeByTipo(groupedJuris),
    [groupedJuris, organizeByTipo]
  );
  const groupsByTipoConstitution = React.useMemo(
    () => organizeByTipo(groupedConstitution),
    [groupedConstitution, organizeByTipo]
  );
  const groupsByTipoStatutes = React.useMemo(
    () => organizeByTipo(groupedStatutes),
    [groupedStatutes, organizeByTipo]
  );

  const currentListLoading =
    activeTab === "laws"
      ? lawsLoading
      : activeTab === "oab"
        ? oabLoading
        : activeTab === "jurisprudence"
          ? jurisLoading
          : activeTab === "statutes"
            ? statutesLoading
            : activeTab === "constitution"
              ? constitutionLoading
              : loading;
  const currentListError =
    activeTab === "laws"
      ? lawsError
      : activeTab === "oab"
        ? oabError
        : activeTab === "jurisprudence"
          ? jurisError
          : activeTab === "statutes"
            ? statutesError
            : activeTab === "constitution"
              ? constitutionError
              : error;
  const currentGroupsByTipo =
    activeTab === "laws"
      ? groupsByTipoLaws
      : activeTab === "oab"
        ? groupsByTipoOab
        : activeTab === "jurisprudence"
          ? groupsByTipoJuris
          : activeTab === "statutes"
            ? groupsByTipoStatutes
            : activeTab === "constitution"
              ? groupsByTipoConstitution
              : groupsByTipoCodes;
  const visibleGroupsByTipo = React.useMemo(() => {
    if (
      activeTab === "codes" ||
      activeTab === "laws" ||
      activeTab === "oab" ||
      activeTab === "jurisprudence" ||
      activeTab === "statutes" ||
      activeTab === "constitution"
    ) {
      return currentGroupsByTipo;
    }
    return currentGroupsByTipo.filter(({ tipo }) => tabMatchesTipo(activeTab, tipo));
  }, [activeTab, currentGroupsByTipo, tabMatchesTipo]);

  React.useEffect(() => {
    if (loading) return;
    if (
      activeTab === "codes" ||
      activeTab === "laws" ||
      activeTab === "oab" ||
      activeTab === "statutes" ||
      activeTab === "constitution"
    ) {
      return;
    }
    const hasMatches = groupsByTipoCodes.some(({ tipo }) =>
      tabMatchesTipo(activeTab, tipo)
    );
    if (hasMatches) return;

    const firstAvailable = tabs.find((tab) =>
      groupsByTipoCodes.some(({ tipo }) => tabMatchesTipo(tab.id, tipo))
    );
    if (firstAvailable) setActiveTab(firstAvailable.id);
  }, [activeTab, groupsByTipoCodes, loading, tabMatchesTipo, tabs]);

  const openGroup = (groupKey: string) => {
    const sourceGroups =
      activeTab === "laws"
        ? groupedLaws
        : activeTab === "oab"
          ? groupedOab
          : activeTab === "jurisprudence"
            ? groupedJuris
            : activeTab === "statutes"
              ? groupedStatutes
              : activeTab === "constitution"
                ? groupedConstitution
                : groupedCodes;
    const sourceUrl =
      activeTab === "laws"
        ? VADE_LAWS_URL
        : activeTab === "oab"
          ? VADE_OAB_URL
          : activeTab === "jurisprudence"
            ? VADE_JURIS_URL
            : activeTab === "statutes"
              ? VADE_STATUTES_DETAIL_URL
              : activeTab === "constitution"
                ? VADE_CONSTITUTION_DETAIL_URL
                : VADE_API_URL;
    const group = sourceGroups.find((entry) => entry.key === groupKey) || null;
    if (!group) return;

    setSelectedGroupKey(group.key);
    setSelectedGroup(group);
    setSelectedGroupCodes(group.codes);
    setSelectedSource(
      activeTab === "laws"
        ? "laws"
        : activeTab === "oab"
          ? "oab"
          : activeTab === "jurisprudence"
            ? "jurisprudence"
            : activeTab === "statutes"
              ? "statutes"
              : activeTab === "constitution"
                ? "constitution"
                : "codes"
    );
    setArticleQuery("");
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const nomecodigo =
      group.codes.find((code) => code.nomecodigo?.trim())?.nomecodigo ||
      group.label;
    const isStatutesTab = activeTab === "statutes";
    const isConstitutionTab = activeTab === "constitution";
    const isJurisTab = activeTab === "jurisprudence";
    const detailMatch = isStatutesTab || isConstitutionTab
      ? {
          idcodigo: group.codes.find((code) => code.idcodigo?.trim())?.idcodigo || "",
          nomecodigo: nomecodigo || "",
          titulo: group.codes.find((code) => code.titulo?.trim())?.titulo || "",
          cabecalho:
            group.codes.find((code) => code.cabecalho?.trim())?.cabecalho ||
            group.description ||
            "",
        }
      : null;
    if (!nomecodigo?.trim() && !isJurisTab) return;

    const fetchDetail = async () => {
      setSelectedLoading(true);
      setSelectedError(null);
      try {
        const headers: Record<string, string> = { Accept: "application/json" };
        const token =
          typeof window !== "undefined"
            ? window.localStorage.getItem(TOKEN_KEY)
            : null;
        if (token) headers.Authorization = `Bearer ${token}`;

        const url =
          isStatutesTab || isConstitutionTab || isJurisTab
            ? sourceUrl
            : `${sourceUrl}?nomecodigo=${encodeURIComponent(nomecodigo)}`;
        let response = await fetch(url, { headers });
        if ((response.status === 401 || response.status === 403) && token) {
          response = await fetch(url, { headers: { Accept: "application/json" } });
        }
        if (!response.ok) {
          throw new Error(`Falha ao carregar detalhes (${response.status})`);
        }
        const payload = await response.json();
        const loaded = normalizeCollection(payload);
        const normalizedNomecodigo = normalizeText(nomecodigo);
        const matching = loaded.filter(
          (code) => normalizeText(code.nomecodigo ?? "") === normalizedNomecodigo
        );
        if ((isStatutesTab || isConstitutionTab) && detailMatch) {
          const targetId = detailMatch.idcodigo.trim();
          const targetNome = normalizeText(detailMatch.nomecodigo);
          const targetTitulo = normalizeText(detailMatch.titulo);
          const targetCabecalho = normalizeText(detailMatch.cabecalho);
          const statutesFiltered = loaded.filter((code) => {
            if (targetId && code.idcodigo?.trim() === targetId) return true;
            const codeNome = normalizeText(code.nomecodigo ?? "");
            if (targetNome && codeNome === targetNome) return true;
            const codeTitulo = normalizeText(code.titulo ?? "");
            if (targetTitulo && codeTitulo === targetTitulo) return true;
            const codeCabecalho = normalizeText(code.cabecalho ?? "");
            if (targetCabecalho && codeCabecalho === targetCabecalho) return true;
            return false;
          });
          if (statutesFiltered.length > 0) {
            setSelectedGroupCodes(statutesFiltered);
          } else {
            setSelectedGroupCodes(loaded);
          }
        } else if (isJurisTab) {
          const targetCabecalho = normalizeText(group.label);
          const jurisFiltered = loaded.filter(
            (code) => normalizeText(code.cabecalho ?? "") === targetCabecalho
          );
          if (jurisFiltered.length > 0) {
            setSelectedGroupCodes(jurisFiltered);
          } else {
            setSelectedGroupCodes(loaded);
          }
        } else if (matching.length > 0) {
          setSelectedGroupCodes(matching);
        }
      } catch (detailError) {
        setSelectedError(
          detailError instanceof Error
            ? detailError.message
            : "Erro ao carregar detalhes."
        );
      } finally {
        setSelectedLoading(false);
      }
    };

    void fetchDetail();
  };

  const resetDetail = () => {
    setSelectedGroupKey(null);
    setSelectedGroup(null);
    setSelectedGroupCodes([]);
    setSelectedError(null);
    setArticleQuery("");
    setHighlightedArticleId(null);
    setSelectedSource("codes");
  };

  const handleArticleSelect = React.useCallback(
    (articleId: string) => {
      if (typeof document !== "undefined") {
        const target = document.getElementById(`article-${articleId}`);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setHighlightedArticleId(articleId);
      if (highlightTimerRef.current) {
        window.clearTimeout(highlightTimerRef.current);
      }
      highlightTimerRef.current = window.setTimeout(() => {
        setHighlightedArticleId((current) =>
          current === articleId ? null : current
        );
      }, 1600);
      if (isMobile) {
        setIsNavOpen(false);
      }
    },
    [isMobile]
  );

  React.useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        window.clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

  const articleNavGroups = React.useMemo<ArticleNavGroup[]>(() => {
    if (!selectedGroup) return [];
    if (selectedSource === "jurisprudence") {
      const sortedRecords = [...selectedGroupCodes].sort((a, b) => {
        const aOrder =
          parseOrder(a.enunciado || "") ??
          parseOrder(a.normativo || "") ??
          parseOrder(a.ordem || "") ??
          parseOrder(a.num_artigo || "");
        const bOrder =
          parseOrder(b.enunciado || "") ??
          parseOrder(b.normativo || "") ??
          parseOrder(b.ordem || "") ??
          parseOrder(b.num_artigo || "");
        if (aOrder === null && bOrder === null) return 0;
        if (aOrder === null) return 1;
        if (bOrder === null) return -1;
        return aOrder - bOrder;
      });

      const items = sortedRecords.map((record, index) => {
        const orderValue =
          parseOrder(record.enunciado || "") ??
          parseOrder(record.normativo || "") ??
          parseOrder(record.ordem || "") ??
          parseOrder(record.num_artigo || "") ??
          index + 1;
        return {
          articleId: record.id,
          label: `Súmula nº ${orderValue ?? index + 1}`,
          order: orderValue ?? null,
        };
      });

      return [
        {
          key: "jurisprudencia",
          label: "Jurisprudência",
          order: null,
          priority: 0,
          items: items.sort((a, b) =>
            a.order === null && b.order === null
              ? a.label.localeCompare(b.label, "pt-BR")
              : (a.order ?? 0) - (b.order ?? 0)
          ),
        },
      ];
    }
    if (selectedSource === "statutes") {
      const sortedRecords = [...selectedGroupCodes].sort((a, b) => {
        const aOrder = parseOrder(extractArticleLabel(a) || "");
        const bOrder = parseOrder(extractArticleLabel(b) || "");
        if (aOrder === null && bOrder === null) return 0;
        if (aOrder === null) return 1;
        if (bOrder === null) return -1;
        return aOrder - bOrder;
      });

      const items = sortedRecords.map((record, index) => {
        const label = extractArticleLabel(record) || String(index + 1);
        const order = parseOrder(label) ?? index + 1;
        return {
          articleId: record.id,
          label,
          order,
        };
      });

      return [
        {
          key: "estatutos",
          label: "Artigos",
          order: null,
          priority: 0,
          items: items.sort((a, b) =>
            a.order === null && b.order === null
              ? a.label.localeCompare(b.label, "pt-BR")
              : (a.order ?? 0) - (b.order ?? 0)
          ),
        },
      ];
    }

    const card = buildCardSections(selectedGroup, selectedGroupCodes);
    const codeById = new Map(selectedGroupCodes.map((code) => [code.id, code]));
    const groups = new Map<string, ArticleNavGroup>();

    card.sections.forEach((section) => {
      section.items.forEach((item) => {
        const code = codeById.get(item.articleId);
        const parteRaw = code?.parte?.trim() || "Sem parte";
        const parteKey = parteRaw.toLowerCase() || "sem-parte";
        const parteOrder = code?.parte ? parseOrder(code.parte) : null;
        const bucket =
          groups.get(parteKey) ||
          (() => {
            const created: ArticleNavGroup = {
              key: parteKey,
              label: parteRaw,
              order: parteOrder,
              priority: getPartePriority(parteRaw),
              items: [],
            };
            groups.set(parteKey, created);
            return created;
          })();

        if (!bucket.items.some((entry) => entry.articleId === item.articleId)) {
          bucket.items.push({
            articleId: item.articleId,
            label: item.articleNumber || item.orderLabel || "-",
            order: parseOrder(item.articleNumber || item.orderLabel || ""),
          });
        }
      });
    });

    const sortByOrder = (
      a: number | null,
      b: number | null,
      fallback: () => number
    ) => {
      if (a === null && b === null) return fallback();
      if (a === null) return 1;
      if (b === null) return -1;
      return a - b;
    };

    return Array.from(groups.values())
      .map((group) => ({
        ...group,
        items: [...group.items].sort((a, b) =>
          sortByOrder(a.order, b.order, () => a.label.localeCompare(b.label, "pt-BR"))
        ),
      }))
      .sort((a, b) =>
        a.priority !== b.priority
          ? a.priority - b.priority
          : sortByOrder(a.order, b.order, () =>
              a.label.localeCompare(b.label, "pt-BR")
            )
      );
  }, [
    buildCardSections,
    extractArticleLabel,
    getPartePriority,
    parseOrder,
    selectedGroup,
    selectedGroupCodes,
    selectedSource,
  ]);

  const filteredNavGroups = React.useMemo(() => {
    const term = articleQuery.trim().toLowerCase();
    if (!term) return articleNavGroups;
    return articleNavGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.label.toLowerCase().includes(term)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [articleNavGroups, articleQuery]);

  const baseGrouped =
    activeTab === "laws"
      ? groupedLaws
      : activeTab === "oab"
        ? groupedOab
        : activeTab === "jurisprudence"
          ? groupedJuris
          : activeTab === "statutes"
            ? groupedStatutes
            : activeTab === "constitution"
              ? groupedConstitution
              : groupedCodes;

  return (
    <VadeMecumContainer>
      <Header>
        <h1>Vade Mecum Digital</h1>
        <p>
          Consulte os codigos oficiais, visualize seus artigos e navegue por
          secoes especificas.
        </p>
      </Header>

      {currentListError && <ErrorMessage>{currentListError}</ErrorMessage>}

      {!selectedGroupKey && (
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
          {currentListLoading ? (
            <ItemList
              singleColumn={
                activeTab === "codes" ||
                activeTab === "laws" ||
                activeTab === "oab" ||
                activeTab === "jurisprudence" ||
                activeTab === "statutes" ||
                activeTab === "constitution"
              }
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  style={{ height: 140, opacity: 0.4, borderStyle: "dashed" }}
                />
              ))}
            </ItemList>
          ) : baseGrouped.length === 0 ? (
            <EmptyState>
              <h3>Nenhum codigo encontrado</h3>
              <p>Ajuste os filtros ou tente novamente mais tarde.</p>
            </EmptyState>
          ) : visibleGroupsByTipo.length === 0 ? (
            <EmptyState>
              <h3>Nenhum codigo encontrado</h3>
              <p>Nenhum registro encontrado para esta categoria.</p>
            </EmptyState>
          ) : (
            <div>
              {visibleGroupsByTipo.map(({ tipo, groups }) => (
                <GroupSection key={tipo}>
                  {activeTab !== "oab" && <GroupTitle>{tipo}</GroupTitle>}
                  <ItemList
                    singleColumn={
                      activeTab === "codes" ||
                      activeTab === "laws" ||
                      activeTab === "oab" ||
                      activeTab === "jurisprudence" ||
                      activeTab === "statutes" ||
                      activeTab === "constitution"
                    }
                  >
                    {groups.map((group) => {
                      const description = sanitizeGroupDescription(group.description);
                      const isJurisTab = activeTab === "jurisprudence";
                      const isLawsTab = activeTab === "laws";
                      const isOabTab = activeTab === "oab";
                      return (
                        <ItemCard key={group.key} onClick={() => openGroup(group.key)}>
                          <h3>{group.label}</h3>
                          {!isJurisTab &&
                            !isLawsTab &&
                            !isOabTab &&
                            (description ? (
                              <p>{description}</p>
                            ) : !group.description ? (
                              <p>Sem descricao cadastrada.</p>
                            ) : null)}
                        </ItemCard>
                      );
                    })}
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
              <BackToListButton type="button" onClick={resetDetail}>
                <ArrowLeft size={18} />
                Voltar para lista
              </BackToListButton>

              <ArticleContent>
                <Card style={{ padding: 24 }}>
                  {selectedSource !== "jurisprudence" &&
                    selectedSource !== "statutes" && (
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
                    const card = buildCardSections(selectedGroup, selectedGroupCodes);
                    const isLawDetail = selectedSource === "laws";
                    const isJurisDetail = selectedSource === "jurisprudence";
                    const isStatutesDetail = selectedSource === "statutes";
                    const primaryRecord = selectedGroupCodes[0];
                    const trim = (value?: string | null) =>
                      value && typeof value === "string" ? value.trim() : "";
                    const cabecalhoValue =
                      trim(primaryRecord?.cabecalho) || selectedGroup.label || "";
                    const tituloValue = (() => {
                      const titulo = trim(primaryRecord?.titulo);
                      const tituloTexto = trim(primaryRecord?.titulotexto);
                      if (titulo && tituloTexto) return `${titulo} - ${tituloTexto}`;
                      return titulo || tituloTexto;
                    })();
                    if (isStatutesDetail) {
                      const sortedRecords = [...selectedGroupCodes].sort((a, b) => {
                        const aOrder = parseOrder(extractArticleLabel(a));
                        const bOrder = parseOrder(extractArticleLabel(b));
                        if (aOrder === null && bOrder === null) return 0;
                        if (aOrder === null) return 1;
                        if (bOrder === null) return -1;
                        return aOrder - bOrder;
                      });

                      return (
                        <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
                          {cabecalhoValue && (
                            <p style={{ fontWeight: 700, fontSize: 16 }}>
                              {cabecalhoValue}
                            </p>
                          )}
                          {tituloValue && (
                            <p style={{ fontWeight: 700, fontSize: 14 }}>
                              {tituloValue}
                            </p>
                          )}
                          <p style={{ fontWeight: 700, fontSize: 14 }}>Artigos</p>
                          <div style={{ display: "grid", gap: 8 }}>
                            {sortedRecords.map((record, index) => {
                              const { before, art, after } = splitArticleHighlight(
                                record.normativo
                              );
                              return (
                                <p
                                  key={`${record.id || record.nomecodigo || index}`}
                                  id={`article-${record.id}`}
                                  style={{
                                    whiteSpace: "pre-wrap",
                                    scrollMarginTop: 90,
                                    borderRadius: 8,
                                  }}
                                  className={
                                    highlightedArticleId === record.id
                                      ? "article-highlight"
                                      : undefined
                                  }
                                >
                                  {before}
                                  {art ? (
                                    <span className="article-label">{art}</span>
                                  ) : null}
                                  {after}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    if (isJurisDetail) {
                      const sortedRecords = [...selectedGroupCodes].sort((a, b) => {
                        const aOrder = parseOrder(a.ordem);
                        const bOrder = parseOrder(b.ordem);
                        if (aOrder === null && bOrder === null) return 0;
                        if (aOrder === null) return 1;
                        if (bOrder === null) return -1;
                        return aOrder - bOrder;
                      });

                      const normalizeValue = (value: string | undefined | null) => {
                        const trimmed = trim(value);
                        if (!trimmed) return "";
                        const normalized = normalizeText(trimmed);
                        const isBlocked =
                          normalized === "ordenado por numero" ||
                          normalized === "ordenado por numero.";
                        if (isBlocked) return "";
                        return trimmed;
                      };

                      const fallbackType = normalizeValue(
                        sortedRecords.find((record) => normalizeValue(record.tipo))?.tipo
                      );
                      const fallbackRamo = normalizeValue(
                        sortedRecords.find((record) => normalizeValue(record.ramotexto))?.ramotexto
                      );
                      const fallbackAssunto = normalizeValue(
                        sortedRecords.find((record) => normalizeValue(record.assuntotexto))
                          ?.assuntotexto
                      );
                      return (
                        <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
                          {cabecalhoValue && (
                            <p
                              style={{
                                fontWeight: 700,
                                fontSize: 16,
                                marginBottom: 16,
                              }}
                            >
                              {cabecalhoValue}
                            </p>
                          )}
                          <div style={{ display: "grid", gap: 16 }}>
                            {sortedRecords.map((record, index) => {
                              const typeValue = normalizeValue(record.tipo) || fallbackType;
                              const ramoValue = normalizeValue(record.ramotexto) || fallbackRamo;
                              const assuntoValue =
                                normalizeValue(record.assuntotexto) || fallbackAssunto;
                              const recordEnunciado =
                                trim(record.enunciado) ||
                                trim(record.normativo) ||
                                "Sem enunciado cadastrado.";

                              return (
                                <div
                                  key={`${record.id || record.nomecodigo || index}`}
                                  id={`article-${record.id}`}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                    scrollMarginTop: 90,
                                  }}
                                  className={
                                    highlightedArticleId === record.id
                                      ? "article-highlight"
                                      : undefined
                                  }
                                >
                                  {typeValue && (
                                    <p
                                      style={{
                                        fontWeight: 700,
                                        fontSize: 12,
                                      }}
                                    >
                                      {typeValue}
                                    </p>
                                  )}
                                  {ramoValue && (
                                    <p
                                      style={{
                                        fontWeight: 700,
                                        fontSize: 15,
                                      }}
                                    >
                                      {ramoValue}
                                    </p>
                                  )}
                                  {assuntoValue && (
                                    <p
                                      style={{
                                        fontWeight: 700,
                                        fontSize: 15,
                                      }}
                                    >
                                      {assuntoValue}
                                    </p>
                                  )}
                                  <p
                                    style={{
                                      whiteSpace: "pre-wrap",
                                      marginBottom: 0,
                                    }}
                                  >
                                    {recordEnunciado}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
                        {card.sections.map((section, index) => (
                          <div key={section.key}>
                            {isLawDetail ? (
                              <>
                                {index === 0 && selectedGroup.label && (
                                  <p
                                    style={{
                                      fontWeight: 700,
                                      fontSize: 15,
                                      marginBottom: 24,
                                    }}
                                  >
                                    {selectedGroup.label}
                                  </p>
                                )}
                                {section.tituloLine && (
                                  <p style={{ marginBottom: 12 }}>{section.tituloLine}</p>
                                )}
                                <p style={{ marginBottom: 12, fontWeight: 600 }}>Artigos</p>
                              </>
                            ) : (
                              <>
                                {section.parteLine && (
                                  <p>
                                    <span className="article-part-label">
                                      {section.parteLine}
                                    </span>
                                  </p>
                                )}
                                <p>{section.livroLine}</p>
                                <p>{section.tituloLine}</p>
                                <p>{section.capituloLine}</p>
                              </>
                            )}
                            <div style={{ display: "grid", gap: 8 }}>
                              {section.items.map((item, index) => {
                                const { before, art, after } = splitArticleHighlight(
                                  item.normativo
                                );
                                return (
                                  <p
                                    key={`${section.key}-${index}`}
                                    id={`article-${item.articleId}`}
                                    style={{
                                      whiteSpace: "pre-wrap",
                                      scrollMarginTop: 90,
                                      borderRadius: 8,
                                    }}
                                    className={
                                      highlightedArticleId === item.articleId
                                        ? "article-highlight"
                                        : undefined
                                    }
                                  >
                                    {before}
                                    {art ? (
                                      <span className="article-label">{art}</span>
                                    ) : null}
                                    {after}
                                  </p>
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
              <ArticleGroupsWrapper>
                {filteredNavGroups.map((group) => (
                  <ArticleGroup key={group.key}>
                    <ArticleGroupTitle>{group.label}</ArticleGroupTitle>
                    <ArticleGrid>
                      {group.items.map((item) => (
                        <ArticleButton
                          key={`${group.key}-${item.articleId}`}
                          type="button"
                          onClick={() => handleArticleSelect(item.articleId)}
                        >
                          {selectedSource === "jurisprudence" ||
                          selectedSource === "statutes"
                            ? item.label || "-"
                            : `Art. ${item.label || "-"}`}
                        </ArticleButton>
                      ))}
                    </ArticleGrid>
                  </ArticleGroup>
                ))}
                {filteredNavGroups.length === 0 && (
                  <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                    Nenhum artigo encontrado
                  </p>
                )}
              </ArticleGroupsWrapper>
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
    idcodigo: getString(record, "idcodigo"),
    tipo: getFirstString(record, ["Tipo", "tipo", "tipoTexto", "tipo_texto"]),
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
    normativo: getFirstString(
      record,
      [
        "Normativo",
        "normativo",
        "Artigos",
        "artigos",
        "texto",
        "Texto",
        "Enunciado",
        "enunciado",
      ]
    ),
    ordem: getFirstString(record, ["Ordem", "ordem"]),
    ramotexto: getFirstString(record, [
      "ramotexto",
      "ramotextom",
      "ramo",
      "ramo_texto",
      "ramoTexto",
      "RamoTexto",
    ]),
    assuntotexto: getFirstString(record, [
      "assuntotexto",
      "assunto",
      "assuntoTexto",
      "AssuntoTexto",
      "assunto_texto",
    ]),
    enunciado: getFirstString(record, ["enunciado", "Enunciado"]),
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

const normalizeJurisGroupCollection = (payload: unknown): VadeMecumCode[] => {
  if (!payload) return [];
  let items: unknown[] = [];

  if (Array.isArray(payload)) {
    items = payload;
  } else if (isRecord(payload)) {
    const itemsCandidate = payload["items"];
    const dataCandidate = payload["data"];
    if (Array.isArray(itemsCandidate)) {
      items = itemsCandidate;
    } else if (Array.isArray(dataCandidate)) {
      items = dataCandidate;
    }
  }

  return items.map((item, index) => {
    const record: UnknownRecord = isRecord(item) ? item : {};
    const cabecalho = getFirstString(record, ["cabecalho", "Cabecalho"], "");
    const label = cabecalho || `Grupo ${index + 1}`;
    return normalizeRecord(
      {
        id: `juris-${index}`,
        tipo: "Jurisprudência",
        nomecodigo: label,
        cabecalho: label,
      },
      index
    );
  });
};

const normalizeLawsGroupCollection = (payload: unknown): VadeMecumCode[] => {
  if (!payload) return [];
  let items: unknown[] = [];

  if (Array.isArray(payload)) {
    items = payload;
  } else if (isRecord(payload)) {
    const itemsCandidate = payload["items"];
    const dataCandidate = payload["data"];
    if (Array.isArray(itemsCandidate)) {
      items = itemsCandidate;
    } else if (Array.isArray(dataCandidate)) {
      items = dataCandidate;
    }
  }

  return items.map((item, index) => {
    const record: UnknownRecord = isRecord(item) ? item : {};
    const nomecodigo = getFirstString(record, ["nomecodigo", "Nomecodigo"], "");
    const label = nomecodigo || `Lei ${index + 1}`;
    return normalizeRecord(
      {
        id: `lei-${index}`,
        tipo: "Leis",
        nomecodigo: label,
        cabecalho: "",
      },
      index
    );
  });
};

const normalizeOabCapaCollection = (payload: unknown): VadeMecumCode[] => {
  if (!payload) return [];
  let items: unknown[] = [];

  if (Array.isArray(payload)) {
    items = payload;
  } else if (isRecord(payload)) {
    const itemsCandidate = payload["items"];
    const dataCandidate = payload["data"];
    if (Array.isArray(itemsCandidate)) {
      items = itemsCandidate;
    } else if (Array.isArray(dataCandidate)) {
      items = dataCandidate;
    }
  }

  return items.map((item, index) => {
    const label =
      typeof item === "string"
        ? item.trim()
        : getFirstString(item as UnknownRecord, ["nomecodigo", "Nomecodigo"], "");
    const safeLabel = label || `OAB ${index + 1}`;
    return normalizeRecord(
      {
        id: `oab-${index}`,
        tipo: "OAB",
        nomecodigo: safeLabel,
        cabecalho: "",
      },
      index
    );
  });
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
