import React from "react";
import { buildApiUrl } from "@/lib/api";
import RichTextEditor from "@/components/RichTextEditor";
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Users,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronDown,
} from "lucide-react";

type AdminDashboardProps = {
  onNavigate?: (page: string) => void;
};

type SidebarItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type CourseItem = {
  id: string;
  nome?: string;
  titulo?: string;
  status?: string;
};

type CourseModulo = {
  id: string;
  nome?: string;
  titulo?: string;
  itens?: CourseItem[];
};

type CourseAssunto = {
  id: string;
  nome?: string;
  titulo?: string;
  modulos?: CourseModulo[];
};

type CourseOption = {
  id: string;
  nome: string;
};

type CoursesSectionProps = {
  onNavigate?: (page: string) => void;
};

type CourseCategory = {
  id: string;
  nome: string;
  imagem: string;
  cursos_ids: string[];
};

type CourseModuleOption = {
  id: string;
  nome: string;
  itens_ids?: string[];
};

type CourseListItem = {
  id: string;
  nome: string;
  imagem: string;
  categoria_id: string;
  modulos_ids: string[];
};

type CourseItemOption = {
  id: string;
  nome: string;
};

type CourseItemList = {
  id: string;
  titulo: string;
  tipo: string;
  conteudo: string;
  modulo_id: string;
  modulos?: Array<{ id?: string } | string>;
};

type AdminQuestion = {
  id: string;
  enunciado: string;
  alternativa_a?: string;
  alternativa_b?: string;
  alternativa_c?: string;
  alternativa_d?: string;
  alternativa_e?: string;
  resposta_correta?: string;
  disciplina: string;
  assunto: string;
  banca: string;
  orgao: string;
  cargo: string;
  concurso: string;
  area_conhecimento: string;
};

type QuestionFilters = {
  disciplina: string;
  assunto: string;
  banca: string;
  orgao: string;
  cargo: string;
  concurso: string;
  area_conhecimento: string;
};

type QuestionFilterOptions = {
  disciplina: string[];
  assunto: string[];
  banca: string[];
  orgao: string[];
  cargo: string[];
  concurso: string[];
  area_conhecimento: string[];
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses", label: "Meus cursos", icon: BookOpen },
  { id: "questoes", label: "Questoes", icon: HelpCircle },
  { id: "users", label: "Usuarios", icon: Users },
  { id: "settings", label: "Configuracoes", icon: Settings },
];

const TOKEN_KEY = "pantheon:token";
const COURSES_ASSUNTOS_URL = buildApiUrl("/meus-cursos/assuntos");
const COURSES_MODULOS_URL = buildApiUrl("/meus-cursos/modulos");
const COURSES_ITENS_URL = buildApiUrl("/meus-cursos/itens");
const COURSES_LIST_URL = buildApiUrl("/cursos");
const COURSE_CATEGORIES_URL = buildApiUrl("/cursos/categorias");
const COURSE_MODULES_URL = buildApiUrl("/meus-cursos/modulos");
const COURSE_ITEMS_URL = buildApiUrl("/meus-cursos/itens");
const QUESTIONS_API_URL = buildApiUrl("/questoes");
const QUESTION_FILTERS_API_URL = buildApiUrl("/questoes/filtros");
const QUESTIONS_COUNT_API_URL = buildApiUrl("/questoes/contador");

const AdminDashboard = ({ onNavigate }: AdminDashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [section, setSection] = React.useState("dashboard");

  const renderSection = () => {
    switch (section) {
      case "courses":
        return <CoursesSection onNavigate={onNavigate} />;
      case "questoes":
        return <QuestionsSection />;
    case "users":
      return <UsersSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 inset-x-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen((open) => !open)}
              className="lg:hidden text-gray-600"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <div>
              <p className="text-lg font-bold text-gray-900">Pantheon Admin</p>
              <p className="text-xs text-gray-500">Acesso restrito</p>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate("home")}
                className="px-4 py-2 text-sm font-semibold border rounded-full"
              >
                Sair
              </button>
            )}
          </div>
        </div>
      </header>

      <aside
        className={`fixed top-16 bottom-0 left-0 w-56 bg-white border-r border-gray-200 transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-2">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-orange-500 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="lg:ml-56 mt-16 px-6 py-8">{renderSection()}</main>
    </div>
  );
};

const DashboardSection = () => {
  const [questionsCount, setQuestionsCount] = React.useState<number | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    const loadQuestionsCount = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(QUESTIONS_COUNT_API_URL, {
          headers: { Accept: "application/json" },
        });
        if (!response.ok) {
          const message = await response.text();
          throw new Error(
            message || `Falha ao carregar contador (${response.status})`
          );
        }
        const payload = await response.json();
        const normalizedCount = normalizeQuestionsCount(payload);
        if (mounted) setQuestionsCount(normalizedCount);
      } catch (requestError) {
        if (!mounted) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Erro ao carregar contador."
        );
        setQuestionsCount(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadQuestionsCount();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Resumo rapido da plataforma</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Quantidade de questoes</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {loading
              ? "Carregando..."
              : error
              ? "Erro ao carregar"
              : questionsCount?.toLocaleString("pt-BR") ?? "0"}
          </p>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </section>
  );
};

const UsersSection = () => (
  <section className="space-y-4">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Usuarios</h2>
      <p className="text-gray-600">Acompanhe usuarios ativos da plataforma</p>
    </div>
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <p className="text-gray-700">
        Integre aqui a listagem real de usuarios quando a API estiver pronta.
      </p>
    </div>
  </section>
);

const QuestionsSection = () => {
  const [filters, setFilters] = React.useState<QuestionFilters>({
    disciplina: "",
    assunto: "",
    banca: "",
    orgao: "",
    cargo: "",
    concurso: "",
    area_conhecimento: "",
  });
  const [questions, setQuestions] = React.useState<AdminQuestion[]>([]);
  const [filterOptions, setFilterOptions] =
    React.useState<QuestionFilterOptions>({
      disciplina: [],
      assunto: [],
      banca: [],
      orgao: [],
      cargo: [],
      concurso: [],
      area_conhecimento: [],
    });
  const [loadingFilters, setLoadingFilters] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [filtersError, setFiltersError] = React.useState<string | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const updateFilter = (field: keyof QuestionFilters, value: string) => {
    setFilters((previous) => ({ ...previous, [field]: value }));
  };

  const buildQueryString = (currentFilters: QuestionFilters) => {
    const params = new URLSearchParams();
    Object.entries(currentFilters).forEach(([key, value]) => {
      const trimmed = value.trim();
      if (trimmed) params.set(key, trimmed);
    });
    const query = params.toString();
    return query ? `?${query}` : "";
  };

  const loadFilterOptions = React.useCallback(async () => {
    setLoadingFilters(true);
    setFiltersError(null);
    try {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem(TOKEN_KEY)
          : null;
      if (!token) {
        throw new Error("Token nao encontrado. Faca login para carregar filtros.");
      }
      const headers: Record<string, string> = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(QUESTION_FILTERS_API_URL, { headers });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || `Falha ao carregar filtros (${response.status})`
        );
      }
      const payload = await response.json();
      setFilterOptions(normalizeQuestionFilters(payload));
    } catch (requestError) {
      setFiltersError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar filtros."
      );
    } finally {
      setLoadingFilters(false);
    }
  }, []);

  React.useEffect(() => {
    void loadFilterOptions();
  }, [loadFilterOptions]);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem(TOKEN_KEY)
          : null;
      if (!token) {
        setQuestions([]);
        throw new Error("Token nao encontrado. Faca login para buscar questoes.");
      }

      const headers: Record<string, string> = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const query = buildQueryString(filters);
      const response = await fetch(`${QUESTIONS_API_URL}${query}`, { headers });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || `Falha ao carregar questoes (${response.status})`
        );
      }
      const payload = await response.json();
      setQuestions(normalizeQuestionCollection(payload));
      setPage(1);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar questoes."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      disciplina: "",
      assunto: "",
      banca: "",
      orgao: "",
      cargo: "",
      concurso: "",
      area_conhecimento: "",
    });
  };

  const totalQuestions = questions.length;
  const totalPages = Math.max(1, Math.ceil(totalQuestions / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalQuestions);
  const paginatedQuestions = questions.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Questoes</h2>
          <p className="text-gray-600">
            Busque questoes com todos os filtros do endpoint.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600"
          >
            Limpar filtros
          </button>
          <button
            type="button"
            onClick={loadQuestions}
            className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg"
          >
            Buscar questoes
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Disciplina
            </label>
            <select
              value={filters.disciplina}
              onChange={(event) => updateFilter("disciplina", event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              disabled={loadingFilters}
            >
              <option value="">Todas</option>
              {filterOptions.disciplina.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Assunto
            </label>
            <select
              value={filters.assunto}
              onChange={(event) => updateFilter("assunto", event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              disabled={loadingFilters}
            >
              <option value="">Todos</option>
              {filterOptions.assunto.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Banca
            </label>
            <select
              value={filters.banca}
              onChange={(event) => updateFilter("banca", event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              disabled={loadingFilters}
            >
              <option value="">Todas</option>
              {filterOptions.banca.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Orgao
            </label>
            <select
              value={filters.orgao}
              onChange={(event) => updateFilter("orgao", event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              disabled={loadingFilters}
            >
              <option value="">Todos</option>
              {filterOptions.orgao.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Cargo
            </label>
            <select
              value={filters.cargo}
              onChange={(event) => updateFilter("cargo", event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              disabled={loadingFilters}
            >
              <option value="">Todos</option>
              {filterOptions.cargo.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Concurso
            </label>
            <select
              value={filters.concurso}
              onChange={(event) => updateFilter("concurso", event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              disabled={loadingFilters}
            >
              <option value="">Todos</option>
              {filterOptions.concurso.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Area de conhecimento
            </label>
            <select
              value={filters.area_conhecimento}
              onChange={(event) =>
                updateFilter("area_conhecimento", event.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              disabled={loadingFilters}
            >
              <option value="">Todas</option>
              {filterOptions.area_conhecimento.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
        {filtersError && (
          <div className="mt-4 bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
            {filtersError}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="text-sm text-gray-500">
        {loading
          ? "Carregando questoes..."
          : hasSearched
          ? `${questions.length} questoes`
          : "Aguardando busca"}
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-500">
          Carregando questoes...
        </div>
      ) : !hasSearched ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-600">
          Informe os filtros e clique em "Buscar questoes".
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-600">
          Nenhuma questao encontrada.
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedQuestions.map((question) => {
            const alternatives = [
              { label: "A", value: question.alternativa_a },
              { label: "B", value: question.alternativa_b },
              { label: "C", value: question.alternativa_c },
              { label: "D", value: question.alternativa_d },
              { label: "E", value: question.alternativa_e },
            ].filter((item) => item.value);

            return (
              <div
                key={question.id}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-[220px] space-y-1">
                    <p className="text-xs font-semibold text-orange-600">
                      ID {question.id}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {question.enunciado}
                    </p>
                    <div className="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1">
                      {question.disciplina && (
                        <span>Disciplina: {question.disciplina}</span>
                      )}
                      {question.assunto && (
                        <span>Assunto: {question.assunto}</span>
                      )}
                      {question.banca && <span>Banca: {question.banca}</span>}
                      {question.orgao && <span>Orgao: {question.orgao}</span>}
                      {question.cargo && <span>Cargo: {question.cargo}</span>}
                      {question.concurso && (
                        <span>Concurso: {question.concurso}</span>
                      )}
                      {question.area_conhecimento && (
                        <span>Area: {question.area_conhecimento}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {question.banca && (
                      <span className="px-2 py-1 border border-gray-200 rounded-full">
                        {question.banca}
                      </span>
                    )}
                    {question.concurso && (
                      <span className="px-2 py-1 border border-gray-200 rounded-full">
                        {question.concurso}
                      </span>
                    )}
                  </div>
                </div>
                {alternatives.length > 0 && (
                  <div className="mt-3 border-t border-gray-100 pt-3 text-sm text-gray-700 space-y-2">
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Alternativas
                    </p>
                    <div className="space-y-1">
                      {alternatives.map((alternative) => (
                        <p key={alternative.label} className="flex gap-2">
                          <span className="text-gray-500 font-semibold">
                            {alternative.label}.
                          </span>
                          <span>{alternative.value}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {question.resposta_correta && (
                  <div className="mt-2 text-xs text-gray-500">
                    Resposta correta:{" "}
                    <span className="font-semibold text-gray-700">
                      {question.resposta_correta}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {hasSearched && questions.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Mostrando {startIndex + 1}-{endIndex} de {totalQuestions}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 disabled:opacity-60"
              disabled={safePage <= 1}
            >
              Anterior
            </button>
            <span className="text-xs text-gray-500">
              Pagina {safePage} de {totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setPage((previous) => Math.min(totalPages, previous + 1))
              }
              className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 disabled:opacity-60"
              disabled={safePage >= totalPages}
            >
              Proxima
            </button>
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              className="px-2 py-1 text-xs border border-gray-200 rounded-lg text-gray-600"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      )}
    </section>
  );
};

const CoursesSection = ({ onNavigate }: CoursesSectionProps) => {
  const [assuntos, setAssuntos] = React.useState<CourseAssunto[]>([]);
  const loading = false;
  const [error, setError] = React.useState<string | null>(null);
  const [savingKey, setSavingKey] = React.useState<string | null>(null);
  const [courseOptions, setCourseOptions] = React.useState<CourseOption[]>([]);
  const [loadingCourseOptions, setLoadingCourseOptions] =
    React.useState(false);
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [categoryName, setCategoryName] = React.useState("");
  const [categoryImage, setCategoryImage] = React.useState("");
  const [categoryImageName, setCategoryImageName] = React.useState("");
  const [categoryCourses, setCategoryCourses] = React.useState<string[]>([]);
  const [categoryError, setCategoryError] = React.useState<string | null>(null);
  const [categorySaving, setCategorySaving] = React.useState(false);
  const [categories, setCategories] = React.useState<CourseCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = React.useState(false);
  const [categoryEditingId, setCategoryEditingId] = React.useState<string | null>(
    null
  );
  const [categoryDeleteTarget, setCategoryDeleteTarget] =
    React.useState<CourseCategory | null>(null);
  const [moduleOptions, setModuleOptions] = React.useState<CourseModuleOption[]>(
    []
  );
  const [modulesLoading, setModulesLoading] = React.useState(false);
  const [courseName, setCourseName] = React.useState("");
  const [courseCategoryId, setCourseCategoryId] = React.useState("");
  const [courseImage, setCourseImage] = React.useState("");
  const [courseImageName, setCourseImageName] = React.useState("");
  const [courseModules, setCourseModules] = React.useState<string[]>([]);
  const [courseSaving, setCourseSaving] = React.useState(false);
  const [courseError, setCourseError] = React.useState<string | null>(null);
  const [courseModalOpen, setCourseModalOpen] = React.useState(false);
  const [courseList, setCourseList] = React.useState<CourseListItem[]>([]);
  const [courseListLoading, setCourseListLoading] = React.useState(false);
  const [courseEditingId, setCourseEditingId] = React.useState<string | null>(
    null
  );
  const [courseDeleteTarget, setCourseDeleteTarget] =
    React.useState<CourseListItem | null>(null);
  const [courseUpdatingId, setCourseUpdatingId] = React.useState<string | null>(
    null
  );
  const [moduleModalOpen, setModuleModalOpen] = React.useState(false);
  const [moduleName, setModuleName] = React.useState("");
  const [moduleItems, setModuleItems] = React.useState<string[]>([]);
  const [moduleSaving, setModuleSaving] = React.useState(false);
  const [moduleError, setModuleError] = React.useState<string | null>(null);
  const [moduleEditingId, setModuleEditingId] = React.useState<string | null>(
    null
  );
  const [moduleDeleteTarget, setModuleDeleteTarget] =
    React.useState<CourseModuleOption | null>(null);
  const [moduleItemModalOpen, setModuleItemModalOpen] =
    React.useState(false);
  const [moduleItemSearch, setModuleItemSearch] = React.useState("");
  const [itemOptions, setItemOptions] = React.useState<CourseItemOption[]>([]);
  const [itemsLoading, setItemsLoading] = React.useState(false);
  const [itemList, setItemList] = React.useState<CourseItemList[]>([]);
  const [itemModalOpen, setItemModalOpen] = React.useState(false);
  const [itemTitulo, setItemTitulo] = React.useState("");
  const [itemTipo, setItemTipo] = React.useState("");
  const [itemConteudo, setItemConteudo] = React.useState("");
  const [itemModuloId, setItemModuloId] = React.useState("");
  const [itemSaving, setItemSaving] = React.useState(false);
  const [itemError, setItemError] = React.useState<string | null>(null);
  const [itemEditingId, setItemEditingId] = React.useState<string | null>(null);
  const [itemDeleteTarget, setItemDeleteTarget] =
    React.useState<CourseItemList | null>(null);
  const [categoryCourseModalOpen, setCategoryCourseModalOpen] =
    React.useState(false);
  const [categoryCourseSearch, setCategoryCourseSearch] = React.useState("");
  const [courseModuleModalOpen, setCourseModuleModalOpen] =
    React.useState(false);
  const [courseModuleSearch, setCourseModuleSearch] = React.useState("");
  const [expandedAssuntos, setExpandedAssuntos] = React.useState<
    Record<string, boolean>
  >({});
  const [expandedModulos, setExpandedModulos] = React.useState<
    Record<string, boolean>
  >({});
  const [formMode, setFormMode] = React.useState<
    | { type: "assunto"; value: string }
    | { type: "modulo"; parentId: string; value: string }
    | { type: "item"; parentId: string; value: string }
    | { type: "edit-assunto"; id: string; value: string }
    | { type: "edit-modulo"; id: string; value: string }
    | { type: "edit-item"; id: string; parentId: string; value: string }
    | null
  >(null);

  const getName = (record: { nome?: string; titulo?: string }) =>
    record.nome || record.titulo || "Sem nome";

  const getCourseLabel = (record: {
    nome?: string;
    titulo?: string;
    name?: string;
    title?: string;
  }) => record.nome || record.titulo || record.name || record.title || "Sem nome";

  const getTokenOrRedirect = React.useCallback(
    (onError: (message: string) => void) => {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem(TOKEN_KEY)
          : null;
      if (!token) {
        const message = "Token nao encontrado. Faca login.";
        onError(message);
        onNavigate?.("home");
        return null;
      }
      return token;
    },
    [onNavigate]
  );

  const normalizeItem = (record: any, index: number): CourseItem => ({
    id: String(record?.id ?? index),
    nome: record?.nome ?? record?.name,
    titulo: record?.titulo ?? record?.title,
    status: record?.status,
  });

  const normalizeModulo = (record: any, index: number): CourseModulo => ({
    id: String(record?.id ?? index),
    nome: record?.nome ?? record?.name,
    titulo: record?.titulo ?? record?.title,
    itens: Array.isArray(record?.itens)
      ? record.itens.map(normalizeItem)
      : Array.isArray(record?.items)
      ? record.items.map(normalizeItem)
      : [],
  });

  const normalizeAssunto = (record: any, index: number): CourseAssunto => ({
    id: String(record?.id ?? index),
    nome: record?.nome ?? record?.name,
    titulo: record?.titulo ?? record?.title,
    modulos: Array.isArray(record?.modulos)
      ? record.modulos.map(normalizeModulo)
      : Array.isArray(record?.modules)
      ? record.modules.map(normalizeModulo)
      : [],
  });

  const normalizeCourseOption = (
    record: any,
    index: number
  ): CourseOption => ({
    id: String(record?.id ?? index),
    nome: getCourseLabel(record),
  });

  const normalizeCourseCategory = (
    record: any,
    index: number
  ): CourseCategory => {
    const cursos =
      record?.cursos_ids ??
      record?.cursosIds ??
      record?.cursos ??
      record?.courses ??
      [];
    const cursosIds = Array.isArray(cursos)
      ? cursos.map((item: any) => String(item?.id ?? item))
      : [];
    return {
      id: String(record?.id ?? record?.uuid ?? index),
      nome: record?.nome ?? record?.name ?? "",
      imagem: record?.imagem ?? record?.image ?? "",
      cursos_ids: cursosIds,
    };
  };

  const normalizeCourseModuleOption = (
    record: any,
    index: number
  ): CourseModuleOption => ({
    id: String(record?.id ?? index),
    nome:
      record?.nome ??
      record?.name ??
      record?.titulo ??
      record?.title ??
      record?.modulo ??
      "Sem nome",
    itens_ids: Array.isArray(record?.itens_ids)
      ? record.itens_ids.map((item: any) => String(item))
      : Array.isArray(record?.itens)
      ? record.itens.map((item: any) => String(item?.id ?? item))
      : [],
  });

  const normalizeCourseListItem = (
    record: any,
    index: number
  ): CourseListItem => ({
    id: String(record?.id ?? record?.uuid ?? index),
    nome: record?.nome ?? record?.name ?? "Sem nome",
    imagem: record?.imagem ?? record?.image ?? "",
    categoria_id: String(
      record?.categoria_id ?? record?.categoriaId ?? record?.categoria ?? ""
    ),
    modulos_ids: Array.isArray(record?.modulos_ids)
      ? record.modulos_ids.map((item: any) => String(item))
      : Array.isArray(record?.modulos)
      ? record.modulos.map((item: any) => String(item?.id ?? item))
      : [],
  });

  const normalizeCourseItemOption = (
    record: any,
    index: number
  ): CourseItemOption => ({
    id: String(record?.id ?? index),
    nome: record?.nome ?? record?.name ?? record?.titulo ?? "Sem nome",
  });

  const normalizeCourseItemList = (
    record: any,
    index: number
  ): CourseItemList => ({
    id: String(record?.id ?? record?.uuid ?? index),
    titulo: record?.titulo ?? record?.title ?? "Sem titulo",
    tipo: record?.tipo ?? record?.type ?? "",
    conteudo: record?.conteudo ?? record?.content ?? "",
    modulo_id: String(
      record?.modulo_id ?? record?.moduloId ?? record?.modulo ?? ""
    ),
    modulos: Array.isArray(record?.modulos) ? record.modulos : [],
  });

  const loadCourseOptions = React.useCallback(async () => {
    setLoadingCourseOptions(true);
    setCategoryError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token = getTokenOrRedirect(setCategoryError);
      if (!token) return;
      headers.Authorization = `Bearer ${token}`;
      const response = await fetch(COURSES_LIST_URL, { headers });
      if (!response.ok) {
        throw new Error(`Falha ao carregar cursos (${response.status})`);
      }
      const payload = await response.json();
      const items = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload?.data)
        ? payload.data
        : [];
      setCourseOptions(items.map(normalizeCourseOption));
    } catch (requestError) {
      setCategoryError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar cursos."
      );
    } finally {
      setLoadingCourseOptions(false);
    }
  }, []);

  React.useEffect(() => {
    void loadCourseOptions();
  }, [loadCourseOptions]);

  const loadCategories = React.useCallback(async () => {
    setCategoriesLoading(true);
    setCategoryError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token = getTokenOrRedirect(setCategoryError);
      if (!token) return;
      headers.Authorization = `Bearer ${token}`;
      const response = await fetch(COURSE_CATEGORIES_URL, { headers });
      if (!response.ok) {
        throw new Error(`Falha ao carregar categorias (${response.status})`);
      }
      const payload = await response.json();
      const items = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload?.data)
        ? payload.data
        : [];
      setCategories(items.map(normalizeCourseCategory));
    } catch (requestError) {
      setCategoryError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar categorias."
      );
    } finally {
      setCategoriesLoading(false);
    }
  }, [getTokenOrRedirect]);

  React.useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const loadModules = React.useCallback(async () => {
    setModulesLoading(true);
    setCourseError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token = getTokenOrRedirect(setCourseError);
      if (!token) return;
      headers.Authorization = `Bearer ${token}`;
      const response = await fetch(COURSE_MODULES_URL, { headers });
      if (!response.ok) {
        throw new Error(`Falha ao carregar modulos (${response.status})`);
      }
      const payload = await response.json();
      const items = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload?.data)
        ? payload.data
        : [];
      setModuleOptions(items.map(normalizeCourseModuleOption));
    } catch (requestError) {
      setCourseError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar modulos."
      );
    } finally {
      setModulesLoading(false);
    }
  }, [getTokenOrRedirect]);

  React.useEffect(() => {
    void loadModules();
  }, [loadModules]);

  const loadItems = React.useCallback(async (): Promise<CourseItemList[]> => {
    setItemsLoading(true);
    setModuleError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token = getTokenOrRedirect(setModuleError);
      if (!token) return [];
      headers.Authorization = `Bearer ${token}`;
      const response = await fetch(COURSE_ITEMS_URL, { headers });
      if (!response.ok) {
        throw new Error(`Falha ao carregar atividades (${response.status})`);
      }
      const payload = await response.json();
      const items = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload?.data)
        ? payload.data
        : [];
      const normalizedOptions = items.map(normalizeCourseItemOption);
      const normalizedList = items.map(normalizeCourseItemList);
      setItemOptions(normalizedOptions);
      setItemList(normalizedList);
      return normalizedList;
    } catch (requestError) {
      setModuleError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar atividades."
      );
      return [];
    } finally {
      setItemsLoading(false);
    }
  }, [getTokenOrRedirect]);

  React.useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const loadCourseList = React.useCallback(async () => {
    setCourseListLoading(true);
    setCourseError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token = getTokenOrRedirect(setCourseError);
      if (!token) return;
      headers.Authorization = `Bearer ${token}`;
      const response = await fetch(COURSES_LIST_URL, { headers });
      if (!response.ok) {
        throw new Error(`Falha ao carregar cursos (${response.status})`);
      }
      const payload = await response.json();
      const items = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload?.data)
        ? payload.data
        : [];
      setCourseList(items.map(normalizeCourseListItem));
    } catch (requestError) {
      setCourseError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar cursos."
      );
    } finally {
      setCourseListLoading(false);
    }
  }, [getTokenOrRedirect]);

  React.useEffect(() => {
    void loadCourseList();
  }, [loadCourseList]);

  const handleCategoryFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result =
        typeof reader.result === "string" ? reader.result : String(reader.result);
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      setCategoryImage(base64);
      setCategoryImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) handleCategoryFile(file);
  };

  const handleCategoryFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) handleCategoryFile(file);
  };

  const toggleCategoryCourse = (id: string) => {
    setCategoryCourses((previous) =>
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id]
    );
  };

  const handleCourseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result =
        typeof reader.result === "string" ? reader.result : String(reader.result);
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      setCourseImage(base64);
      setCourseImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleCourseDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) handleCourseFile(file);
  };

  const handleCourseFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) handleCourseFile(file);
  };

  const toggleCourseModule = (id: string) => {
    setCourseModules((previous) =>
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id]
    );
  };

  const resetCategoryForm = () => {
    setCategoryName("");
    setCategoryImage("");
    setCategoryImageName("");
    setCategoryCourses([]);
    setCategoryCourseSearch("");
    setCategoryEditingId(null);
    setCategoryError(null);
  };

  const resetCourseForm = () => {
    setCourseName("");
    setCourseCategoryId("");
    setCourseImage("");
    setCourseImageName("");
    setCourseModules([]);
    setCourseModuleModalOpen(false);
    setCourseModuleSearch("");
    setCourseError(null);
    setCourseEditingId(null);
  };

  const startEditCategory = (category: CourseCategory) => {
    setCategoryOpen(true);
    setCategoryEditingId(category.id);
    setCategoryName(category.nome || "");
    setCategoryImage(category.imagem || "");
    setCategoryImageName(category.imagem ? "imagem existente" : "");
    setCategoryCourses(category.cursos_ids || []);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setCategorySaving(true);
    setCategoryError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token = getTokenOrRedirect(setCategoryError);
      if (!token) return;
      headers.Authorization = `Bearer ${token}`;
      const response = await fetch(`${COURSE_CATEGORIES_URL}/${categoryId}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Erro ao remover categoria.");
      }
      if (categoryEditingId === categoryId) {
        resetCategoryForm();
      }
      await loadCategories();
    } catch (requestError) {
      setCategoryError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao remover categoria."
      );
    } finally {
      setCategorySaving(false);
    }
  };

  const filteredCourseOptions = React.useMemo(() => {
    const term = categoryCourseSearch.trim().toLowerCase();
    if (!term) return courseOptions;
    return courseOptions.filter((course) =>
      course.nome.toLowerCase().includes(term)
    );
  }, [categoryCourseSearch, courseOptions]);

  const filteredCourseModules = React.useMemo(() => {
    const term = courseModuleSearch.trim().toLowerCase();
    if (!term) return moduleOptions;
    return moduleOptions.filter((module) =>
      module.nome.toLowerCase().includes(term)
    );
  }, [courseModuleSearch, moduleOptions]);

  const getCategoryImagePreview = (value: string) => {
    if (!value) return "";
    if (value.startsWith("http") || value.startsWith("data:")) return value;
    return `data:image/*;base64,${value}`;
  };

  const handleSaveCategory = async () => {
    const trimmedName = categoryName.trim();
    if (!trimmedName || !categoryImage) {
      setCategoryError("Informe nome e imagem da categoria.");
      return;
    }
    setCategorySaving(true);
    setCategoryError(null);
    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const token = getTokenOrRedirect(setCategoryError);
      if (!token) return;
      headers.Authorization = `Bearer ${token}`;
      const url = categoryEditingId
        ? `${COURSE_CATEGORIES_URL}/${categoryEditingId}`
        : COURSE_CATEGORIES_URL;
      const response = await fetch(url, {
        method: categoryEditingId ? "PUT" : "POST",
        headers,
        body: JSON.stringify({
          cursos_ids: categoryCourses,
          imagem: categoryImage,
          nome: trimmedName,
        }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Erro ao salvar categoria.");
      }
      resetCategoryForm();
      await loadCategories();
    } catch (requestError) {
      setCategoryError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao salvar categoria."
      );
    } finally {
      setCategorySaving(false);
    }
  };

  const handleSaveCourse = async () => {
    const trimmedName = courseName.trim();
    if (!trimmedName || !courseCategoryId || !courseImage) {
      setCourseError("Informe nome, categoria e imagem do curso.");
      return;
    }
    setCourseSaving(true);
    setCourseError(null);
    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const token = getTokenOrRedirect(setCourseError);
      if (!token) return;
      headers.Authorization = `Bearer ${token}`;
      const url = courseEditingId
        ? `${COURSES_LIST_URL}/${courseEditingId}`
        : COURSES_LIST_URL;
      const response = await fetch(url, {
        method: courseEditingId ? "PUT" : "POST",
        headers,
        body: JSON.stringify({
          categoria_id: courseCategoryId,
          imagem: courseImage,
          modulos_ids: courseModules,
          nome: trimmedName,
        }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Erro ao salvar curso.");
      }
      resetCourseForm();
      setCourseModalOpen(false);
      await loadCourseOptions();
      await loadCourseList();
    } catch (requestError) {
      setCourseError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao salvar curso."
      );
    } finally {
      setCourseSaving(false);
    }
  };

  const resetModuleForm = () => {
    setModuleName("");
    setModuleItems([]);
    setModuleError(null);
    setModuleEditingId(null);
    setModuleItemSearch("");
  };

  const resetItemForm = () => {
    setItemTitulo("");
    setItemTipo("");
    setItemConteudo("");
    setItemModuloId("");
    setItemError(null);
    setItemEditingId(null);
  };

  const toggleModuleItem = (id: string) => {
    setModuleItems((previous) =>
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id]
    );
  };

  const filteredModuleItems = React.useMemo(() => {
    const term = moduleItemSearch.trim().toLowerCase();
    if (!term) return itemOptions;
    return itemOptions.filter((item) =>
      item.nome.toLowerCase().includes(term)
    );
  }, [itemOptions, moduleItemSearch]);

  const moveModuleItem = (index: number, direction: "up" | "down") => {
    setModuleItems((previous) => {
      const next = [...previous];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return previous;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleSaveModule = async () => {
    const trimmedName = moduleName.trim();
    if (!trimmedName) {
      setModuleError("Informe o nome do modulo.");
      return;
    }
    setModuleSaving(true);
    setModuleError(null);
    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const token = getTokenOrRedirect(setModuleError);
      if (!token) return;
      headers.Authorization = `Bearer ${token}`;
      const url = moduleEditingId
        ? `${COURSES_MODULOS_URL}/${moduleEditingId}`
        : COURSES_MODULOS_URL;
      const response = await fetch(url, {
        method: moduleEditingId ? "PUT" : "POST",
        headers,
        body: JSON.stringify({
          modulo: trimmedName,
          itens_ids: moduleItems,
        }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Erro ao salvar modulo.");
      }
      resetModuleForm();
      setModuleModalOpen(false);
      await loadModules();
    } catch (requestError) {
      setModuleError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao salvar modulo."
      );
    } finally {
      setModuleSaving(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    setModuleSaving(true);
    setModuleError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token = getTokenOrRedirect(setModuleError);
      if (!token) return;
      headers.Authorization = `Bearer ${token}`;
      const response = await fetch(`${COURSES_MODULOS_URL}/${moduleId}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Erro ao remover modulo.");
      }
      await loadModules();
    } catch (requestError) {
      setModuleError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao remover modulo."
      );
    } finally {
      setModuleSaving(false);
    }
  };

  const handleSaveItem = async () => {
    const trimmedTitulo = itemTitulo.trim();
    const trimmedTipo = itemTipo.trim();
    if (!trimmedTitulo || !trimmedTipo) {
      setItemError("Informe titulo e tipo.");
      return;
    }
    setItemSaving(true);
    setItemError(null);
    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const token = getTokenOrRedirect(setItemError);
      if (!token) return;
      headers.Authorization = `Bearer ${token}`;
      const url = itemEditingId
        ? `${COURSE_ITEMS_URL}/${itemEditingId}`
        : COURSE_ITEMS_URL;
      const response = await fetch(url, {
        method: itemEditingId ? "PUT" : "POST",
        headers,
        body: JSON.stringify({
          conteudo: itemConteudo,
          modulo_id: itemModuloId || null,
          tipo: trimmedTipo,
          titulo: trimmedTitulo,
        }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Erro ao salvar item.");
      }
      resetItemForm();
      setItemModalOpen(false);
      await loadItems();
    } catch (requestError) {
      setItemError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao salvar item."
      );
    } finally {
      setItemSaving(false);
    }
  };

  const startEditItem = (item: CourseItemList) => {
    setItemModalOpen(true);
    setItemEditingId(item.id);
    setItemTitulo(item.titulo || "");
    setItemTipo(item.tipo || "");
    setItemConteudo(item.conteudo || "");
    setItemModuloId(item.modulo_id || "");
  };

  const handleDeleteItem = async (itemId: string) => {
    setItemSaving(true);
    setItemError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token = getTokenOrRedirect(setItemError);
      if (!token) return;
      headers.Authorization = `Bearer ${token}`;
      const response = await fetch(`${COURSE_ITEMS_URL}/${itemId}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Erro ao remover item.");
      }
      await loadItems();
    } catch (requestError) {
      setItemError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao remover item."
      );
    } finally {
      setItemSaving(false);
    }
  };

  const startEditModule = async (module: CourseModuleOption) => {
    const latestItems = await loadItems();
    const itemsSource =
      latestItems.length > 0 ? latestItems : itemList;
    const linkedFromModule =
      module.itens_ids && module.itens_ids.length > 0
        ? module.itens_ids.map((id) => String(id))
        : [];
    const linkedFromItems = itemsSource
      .filter((item) => {
        const sameModule =
          item.modulo_id === module.id ||
          item.modulo_id === String(module.id);
        const itemWithModules = item as CourseItemList & {
          modulos?: Array<{ id?: string } | string>;
        };
        const hasModuleRelation = Array.isArray(itemWithModules.modulos)
          ? itemWithModules.modulos.some(
              (modulo) =>
                String(
                  typeof modulo === "string" ? modulo : modulo?.id ?? ""
                ) === String(module.id)
            )
          : false;
        return sameModule || hasModuleRelation;
      })
      .map((item) => item.id);
    setModuleModalOpen(true);
    setModuleEditingId(module.id);
    setModuleName(module.nome || "");
    setModuleItems(
      linkedFromModule.length > 0 ? linkedFromModule : linkedFromItems
    );
  };

  const startEditCourse = (course: CourseListItem) => {
    setCourseModalOpen(true);
    setCourseEditingId(course.id);
    setCourseName(course.nome || "");
    setCourseCategoryId(course.categoria_id || "");
    setCourseImage(course.imagem || "");
    setCourseImageName(course.imagem ? "imagem existente" : "");
    setCourseModules(course.modulos_ids || []);
  };

  const handleDeleteCourse = async (courseId: string) => {
    setCourseSaving(true);
    setCourseError(null);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const token = getTokenOrRedirect(setCourseError);
      if (!token) return;
      headers.Authorization = `Bearer ${token}`;
      const response = await fetch(`${COURSES_LIST_URL}/${courseId}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Erro ao remover curso.");
      }
      if (courseEditingId === courseId) {
        resetCourseForm();
      }
      await loadCourseList();
      await loadCourseOptions();
    } catch (requestError) {
      setCourseError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao remover curso."
      );
    } finally {
      setCourseSaving(false);
    }
  };

  const updateCourseCategory = async (
    course: CourseListItem,
    categoriaId: string
  ) => {
    if (!categoriaId || categoriaId === course.categoria_id) return;
    setCourseUpdatingId(course.id);
    setCourseError(null);
    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const token = getTokenOrRedirect(setCourseError);
      if (!token) return;
      headers.Authorization = `Bearer ${token}`;
      const response = await fetch(`${COURSES_LIST_URL}/${course.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          categoria_id: categoriaId,
          imagem: course.imagem,
          modulos_ids: course.modulos_ids,
          nome: course.nome,
        }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Erro ao atualizar curso.");
      }
      await loadCourseList();
    } catch (requestError) {
      setCourseError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao atualizar curso."
      );
    } finally {
      setCourseUpdatingId(null);
    }
  };

  const submitRequest = async (
    key: string,
    url: string,
    options: RequestInit
  ) => {
    setSavingKey(key);
    setError(null);
    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const token = getTokenOrRedirect(setError);
      if (!token) return;
      headers.Authorization = `Bearer ${token}`;
      const response = await fetch(url, {
        ...options,
        headers: { ...headers, ...(options.headers || {}) },
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Erro ao salvar.");
      }
      setFormMode(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Erro ao salvar."
      );
    } finally {
      setSavingKey(null);
    }
  };

  const handleCreateAssunto = async () => {
    if (!formMode || formMode.type !== "assunto") return;
    const value = formMode.value.trim();
    if (!value) return;
    await submitRequest(
      "assunto-create",
      COURSES_ASSUNTOS_URL,
      {
        method: "POST",
        body: JSON.stringify({ nome: value }),
      }
    );
  };

  const handleUpdateAssunto = async () => {
    if (!formMode || formMode.type !== "edit-assunto") return;
    const value = formMode.value.trim();
    if (!value) return;
    await submitRequest(
      `assunto-update-${formMode.id}`,
      `${COURSES_ASSUNTOS_URL}/${formMode.id}`,
      {
        method: "PUT",
        body: JSON.stringify({ nome: value }),
      }
    );
  };

  const handleDeleteAssunto = async (id: string) => {
    if (!window.confirm("Remover assunto?")) return;
    await submitRequest(
      `assunto-delete-${id}`,
      `${COURSES_ASSUNTOS_URL}/${id}`,
      { method: "DELETE" }
    );
  };

  const handleCreateModulo = async () => {
    if (!formMode || formMode.type !== "modulo") return;
    const value = formMode.value.trim();
    if (!value) return;
    await submitRequest(
      `modulo-create-${formMode.parentId}`,
      `${COURSES_ASSUNTOS_URL}/${formMode.parentId}/modulos`,
      {
        method: "POST",
        body: JSON.stringify({ nome: value }),
      }
    );
  };

  const handleUpdateModulo = async () => {
    if (!formMode || formMode.type !== "edit-modulo") return;
    const value = formMode.value.trim();
    if (!value) return;
    await submitRequest(
      `modulo-update-${formMode.id}`,
      `${COURSES_MODULOS_URL}/${formMode.id}`,
      {
        method: "PUT",
        body: JSON.stringify({ nome: value }),
      }
    );
  };

  const handleDeleteModulo = async (id: string) => {
    if (!window.confirm("Remover modulo?")) return;
    await submitRequest(
      `modulo-delete-${id}`,
      `${COURSES_MODULOS_URL}/${id}`,
      { method: "DELETE" }
    );
  };

  const handleCreateItem = async () => {
    if (!formMode || formMode.type !== "item") return;
    const value = formMode.value.trim();
    if (!value) return;
    await submitRequest(
      `item-create-${formMode.parentId}`,
      `${COURSES_MODULOS_URL}/${formMode.parentId}/itens`,
      {
        method: "POST",
        body: JSON.stringify({ nome: value }),
      }
    );
  };

  const handleUpdateItem = async () => {
    if (!formMode || formMode.type !== "edit-item") return;
    const value = formMode.value.trim();
    if (!value) return;
    await submitRequest(
      `item-update-${formMode.id}`,
      `${COURSES_ITENS_URL}/${formMode.id}`,
      {
        method: "PUT",
        body: JSON.stringify({ nome: value }),
      }
    );
  };

  const handleDeleteCourseItem = async (id: string) => {
    if (!window.confirm("Remover item?")) return;
    await submitRequest(
      `item-delete-${id}`,
      `${COURSES_ITENS_URL}/${id}`,
      { method: "DELETE" }
    );
  };

  const renderForm = (
    label: string,
    value: string,
    onChange: (next: string) => void,
    onCancel: () => void,
    onSave: () => void,
    isSaving: boolean
  ) => (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        className="flex-1 min-w-[220px] px-3 py-2 border border-gray-200 rounded-lg text-sm"
      />
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="px-3 py-2 text-sm rounded-lg bg-orange-500 text-white disabled:opacity-60"
      >
        Salvar
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600"
      >
        Cancelar
      </button>
    </div>
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meus cursos</h2>
          <p className="text-gray-600">
            Cadastre assuntos, modulos e itens dos cursos.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Categorias</h3>
            <p className="text-sm text-gray-600">
              Gerencie as categorias cadastradas.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setCategoryOpen(true);
              resetCategoryForm();
            }}
            className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg"
          >
            Nova categoria
          </button>
        </div>
        {categoriesLoading ? (
          <p className="text-sm text-gray-500">Carregando categorias...</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma categoria cadastrada.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-wrap items-center justify-between gap-3 border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  {category.imagem && (
                    <img
                      src={getCategoryImagePreview(category.imagem)}
                      alt={`Categoria ${category.nome}`}
                      className="w-14 h-14 object-cover rounded-md border border-gray-100"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {category.nome || "Categoria sem nome"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {category.cursos_ids.length} cursos vinculados
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEditCategory(category)}
                    className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryDeleteTarget(category)}
                    className="px-3 py-1 text-xs border border-red-200 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cursos</h3>
            <p className="text-sm text-gray-600">
              Cadastre novos cursos vinculados a categorias e modulos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setCourseModalOpen(true);
              resetCourseForm();
            }}
            className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg"
          >
            Novo curso
          </button>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-gray-900">
              Cursos cadastrados
            </h4>
            <button
              type="button"
              onClick={loadCourseList}
              className="text-xs text-orange-600 hover:underline"
            >
              Atualizar
            </button>
          </div>
          {courseListLoading ? (
            <p className="text-sm text-gray-500">Carregando cursos...</p>
          ) : courseList.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum curso cadastrado.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {courseList.map((course) => {
                const category = categories.find(
                  (item) => item.id === course.categoria_id
                );
                return (
                  <div
                    key={course.id}
                    className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg p-3"
                  >
                  <div className="flex items-center gap-3">
                    {course.imagem && (
                      <img
                        src={getCategoryImagePreview(course.imagem)}
                        alt={`Curso ${course.nome}`}
                        className="w-12 h-12 object-cover rounded-md border border-gray-100"
                      />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {course.nome}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span>Categoria:</span>
                        <select
                          value={course.categoria_id}
                          onChange={(event) =>
                            updateCourseCategory(course, event.target.value)
                          }
                          disabled={courseUpdatingId === course.id}
                          className="px-2 py-1 border border-gray-200 rounded-lg text-xs text-gray-700"
                        >
                          <option value="">Selecione</option>
                          {categories.map((categoryOption) => (
                            <option
                              key={categoryOption.id}
                              value={categoryOption.id}
                            >
                              {categoryOption.nome || "Categoria sem nome"}
                            </option>
                          ))}
                        </select>
                        {courseUpdatingId === course.id && (
                          <span className="text-gray-400">Atualizando...</span>
                        )}
                      </div>
                    </div>
                  </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditCourse(course)}
                        className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setCourseDeleteTarget(course)}
                        className="px-3 py-1 text-xs border border-red-200 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {courseEditingId ? "Editar curso" : "Novo curso"}
                </h3>
                <p className="text-sm text-gray-600">
                  Cadastre nome, categoria, imagem e modulos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCourseModalOpen(false);
                  resetCourseForm();
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Fechar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nome completo do curso
                </label>
                <input
                  value={courseName}
                  onChange={(event) => setCourseName(event.target.value)}
                  placeholder="Ex: Curso Completo OAB 1a fase"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Categoria do curso
                </label>
                <select
                  value={courseCategoryId}
                  onChange={(event) => setCourseCategoryId(event.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Selecione</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nome || "Categoria sem nome"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Imagem do curso
              </label>
              <div
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleCourseDrop}
                className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-sm text-gray-500 flex flex-col gap-2"
              >
                <span>Arraste e solte uma imagem aqui</span>
                <span>ou</span>
                <label className="inline-flex items-center gap-2 text-orange-600 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCourseFileChange}
                  />
                  <span className="underline">selecionar arquivo</span>
                </label>
                {courseImageName && (
                  <p className="text-xs text-gray-600">
                    Arquivo: {courseImageName}
                  </p>
                )}
                {courseImage && (
                  <img
                    src={getCategoryImagePreview(courseImage)}
                    alt="Preview do curso"
                    className="w-full max-h-40 object-cover rounded-md border border-gray-100"
                  />
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Modulos
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCourseModuleModalOpen(true);
                    setCourseModuleSearch("");
                  }}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-700"
                >
                  Inserir modulos
                </button>
              </div>
              {modulesLoading ? (
                <p className="text-sm text-gray-500 mt-2">
                  Carregando modulos...
                </p>
              ) : moduleOptions.length === 0 ? (
                <p className="text-sm text-gray-500 mt-2">
                  Nenhum modulo disponivel.
                </p>
              ) : courseModules.length === 0 ? (
                <p className="text-sm text-gray-500 mt-2">
                  Nenhum modulo selecionado.
                </p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {courseModules.map((moduleId) => {
                    const module = moduleOptions.find(
                      (entry) => entry.id === moduleId
                    );
                    return (
                      <span
                        key={moduleId}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-100 border border-gray-200 rounded-full"
                      >
                        {module?.nome || "Modulo sem nome"}
                        <button
                          type="button"
                          onClick={() => toggleCourseModule(moduleId)}
                          className="text-gray-400 hover:text-gray-600"
                          aria-label="Remover modulo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {courseError && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
                {courseError}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={resetCourseForm}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={handleSaveCourse}
                disabled={courseSaving}
                className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg disabled:opacity-60"
              >
                {courseSaving ? "Salvando..." : "Salvar curso"}
              </button>
            </div>
          </div>
        </div>
      )}

      {courseModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Inserir modulo
              </h3>
              <button
                type="button"
                onClick={() => setCourseModuleModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={courseModuleSearch}
                onChange={(event) => setCourseModuleSearch(event.target.value)}
                placeholder="Buscar por nome..."
                className="flex-1 min-w-[220px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                type="button"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
              >
                Buscar
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl max-h-72 overflow-y-auto">
              <div className="divide-y divide-gray-100">
                {modulesLoading ? (
                  <p className="px-4 py-6 text-sm text-gray-500">
                    Carregando modulos...
                  </p>
                ) : filteredCourseModules.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-gray-500">
                    Nenhum modulo encontrado.
                  </p>
                ) : (
                  filteredCourseModules.map((module) => {
                    const isSelected = courseModules.includes(module.id);
                    return (
                      <div
                        key={module.id}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <span className="text-sm text-gray-900">
                          {module.nome}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleCourseModule(module.id)}
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full border ${
                            isSelected
                              ? "border-gray-300 text-gray-300 cursor-not-allowed"
                              : "border-blue-600 text-blue-600"
                          }`}
                          disabled={isSelected}
                          title={isSelected ? "Adicionado" : "Adicionar"}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setCourseModuleModalOpen(false)}
                className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg"
              >
                Pronto
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Modulo</h3>
            <p className="text-sm text-gray-600">
              Cadastre modulos e vincule atividades.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setModuleModalOpen(true);
              resetModuleForm();
            }}
            className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg"
          >
            Novo modulo
          </button>
        </div>

        {moduleError && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
            {moduleError}
          </div>
        )}

        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-gray-900">
              Modulos cadastrados
            </h4>
            <button
              type="button"
              onClick={loadModules}
              className="text-xs text-orange-600 hover:underline"
            >
              Atualizar
            </button>
          </div>
          {modulesLoading ? (
            <p className="text-sm text-gray-500">Carregando modulos...</p>
          ) : moduleOptions.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum modulo cadastrado.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {moduleOptions.map((module) => (
                <div
                  key={module.id}
                  className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg p-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {module.nome}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEditModule(module)}
                      className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setModuleDeleteTarget(module)}
                      className="px-3 py-1 text-xs border border-red-200 rounded-lg text-red-600 hover:bg-red-50"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Itens</h3>
            <p className="text-sm text-gray-600">
              Cadastre conteudos vinculados a modulos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setItemModalOpen(true);
              resetItemForm();
            }}
            className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg"
          >
            Novo item
          </button>
        </div>

        {itemError && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
            {itemError}
          </div>
        )}

        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-gray-900">
              Itens cadastrados
            </h4>
            <button
              type="button"
              onClick={loadItems}
              className="text-xs text-orange-600 hover:underline"
            >
              Atualizar
            </button>
          </div>
          {itemsLoading ? (
            <p className="text-sm text-gray-500">Carregando itens...</p>
          ) : itemList.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum item cadastrado.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {itemList.map((item) => {
                const module = moduleOptions.find(
                  (entry) => entry.id === item.modulo_id
                );
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.titulo}
                      </p>
                      <p className="text-xs text-gray-500">
                        Modulo: {module?.nome || "Nao informado"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditItem(item)}
                        className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemDeleteTarget(item)}
                        className="px-3 py-1 text-xs border border-red-200 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {courseDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Remover curso
              </h3>
              <button
                type="button"
                onClick={() => setCourseDeleteTarget(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Tem certeza que deseja remover o curso{" "}
              <span className="font-semibold text-gray-900">
                {courseDeleteTarget.nome || "sem nome"}
              </span>
              ?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCourseDeleteTarget(null)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600"
              >
                Nao
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = courseDeleteTarget.id;
                  setCourseDeleteTarget(null);
                  await handleDeleteCourse(id);
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg"
              >
                Sim, remover
              </button>
            </div>
          </div>
        </div>
      )}

      {itemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {itemEditingId ? "Editar item" : "Novo item"}
                </h3>
                <p className="text-sm text-gray-600">
                  Cadastre titulo, tipo, conteudo e modulo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setItemModalOpen(false);
                  resetItemForm();
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Fechar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Titulo
                </label>
                <input
                  value={itemTitulo}
                  onChange={(event) => setItemTitulo(event.target.value)}
                  placeholder="Ex: Introducao"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tipo
                </label>
                <select
                  value={itemTipo}
                  onChange={(event) => setItemTipo(event.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Selecione</option>
                  <option value="Livro">Livro</option>
                  <option value="Video">Video</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Conteudo
              </label>
              <RichTextEditor
                content={itemConteudo}
                onChange={setItemConteudo}
              />
            </div>

            {itemError && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
                {itemError}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={resetItemForm}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                disabled={itemSaving}
                className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg disabled:opacity-60"
              >
                {itemSaving ? "Salvando..." : "Salvar item"}
              </button>
            </div>
          </div>
        </div>
      )}

      {itemDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Remover item
              </h3>
              <button
                type="button"
                onClick={() => setItemDeleteTarget(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Tem certeza que deseja remover o item{" "}
              <span className="font-semibold text-gray-900">
                {itemDeleteTarget.titulo || "sem titulo"}
              </span>
              ?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setItemDeleteTarget(null)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600"
              >
                Nao
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = itemDeleteTarget.id;
                  setItemDeleteTarget(null);
                  await handleDeleteItem(id);
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg"
              >
                Sim, remover
              </button>
            </div>
          </div>
        </div>
      )}

      {moduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {moduleEditingId ? "Editar modulo" : "Novo modulo"}
                </h3>
                <p className="text-sm text-gray-600">
                  Cadastre o nome e selecione atividades.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setModuleModalOpen(false);
                  resetModuleForm();
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Fechar
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome do modulo
              </label>
              <input
                value={moduleName}
                onChange={(event) => setModuleName(event.target.value)}
                placeholder="Ex: Modulo 1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Atividades
              </label>
              <button
                type="button"
                onClick={() => setModuleItemModalOpen(true)}
                className="w-full border border-gray-200 rounded-xl p-4 text-left hover:border-gray-300"
              >
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-blue-600">
                    <Plus className="w-4 h-4" />
                  </span>
                  Inserir atividade
                </div>
              </button>
              {itemsLoading && (
                <p className="text-sm text-gray-500 mt-2">
                  Carregando atividades...
                </p>
              )}
              {!itemsLoading && itemOptions.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Nenhuma atividade disponivel.
                </p>
              )}
              {moduleItems.length > 0 && (
                <div className="mt-3 border border-gray-200 rounded-lg divide-y divide-gray-100">
                  {moduleItems.map((itemId, index) => {
                    const item = itemOptions.find(
                      (entry) => entry.id === itemId
                    );
                    return (
                      <div
                        key={itemId}
                        className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-gray-700"
                      >
                        <span>
                          {index + 1} - {item?.nome || "Atividade selecionada"}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveModuleItem(index, "up")}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-40"
                            title="Mover para cima"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveModuleItem(index, "down")}
                            disabled={index === moduleItems.length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-40"
                            title="Mover para baixo"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleModuleItem(itemId)}
                            className="text-red-500 hover:text-red-600"
                            title="Remover"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {moduleError && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
                {moduleError}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={resetModuleForm}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={handleSaveModule}
                disabled={moduleSaving}
                className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg disabled:opacity-60"
              >
                {moduleSaving ? "Salvando..." : "Salvar modulo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {moduleDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Remover modulo
              </h3>
              <button
                type="button"
                onClick={() => setModuleDeleteTarget(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Tem certeza que deseja remover o modulo{" "}
              <span className="font-semibold text-gray-900">
                {moduleDeleteTarget.nome || "sem nome"}
              </span>
              ?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setModuleDeleteTarget(null)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600"
              >
                Nao
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = moduleDeleteTarget.id;
                  setModuleDeleteTarget(null);
                  await handleDeleteModule(id);
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg"
              >
                Sim, remover
              </button>
            </div>
          </div>
        </div>
      )}

      {moduleItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Inserir conteudo
              </h3>
              <button
                type="button"
                onClick={() => setModuleItemModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={moduleItemSearch}
                onChange={(event) => setModuleItemSearch(event.target.value)}
                placeholder="Buscar por nome..."
                className="flex-1 min-w-[220px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                type="button"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
              >
                Buscar
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl max-h-72 overflow-y-auto">
              <div className="divide-y divide-gray-100">
                {itemsLoading ? (
                  <p className="px-4 py-6 text-sm text-gray-500">
                    Carregando atividades...
                  </p>
                ) : filteredModuleItems.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-gray-500">
                    Nenhuma atividade encontrada.
                  </p>
                ) : (
                  filteredModuleItems.map((item) => {
                    const isSelected = moduleItems.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <span className="text-sm text-gray-900">
                          {item.nome}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleModuleItem(item.id)}
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full border ${
                            isSelected
                              ? "border-gray-300 text-gray-300 cursor-not-allowed"
                              : "border-blue-600 text-blue-600"
                          }`}
                          disabled={isSelected}
                          title={isSelected ? "Adicionado" : "Adicionar"}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setModuleItemModalOpen(false)}
                className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg"
              >
                Pronto
              </button>
            </div>
          </div>
        </div>
      )}

      {categoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {categoryEditingId ? "Editar categoria" : "Nova categoria"}
                </h3>
                <p className="text-sm text-gray-600">
                  Cadastre nome, imagem e vincule cursos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCategoryOpen(false);
                  resetCategoryForm();
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Fechar
              </button>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome da categoria
              </label>
              <input
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                placeholder="Ex: OAB 1a fase"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Imagem da categoria
              </label>
              <div
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleCategoryDrop}
                className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-sm text-gray-500 flex flex-col gap-2"
              >
                <span>Arraste e solte uma imagem aqui</span>
                <span>ou</span>
                <label className="inline-flex items-center gap-2 text-orange-600 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCategoryFileChange}
                  />
                  <span className="underline">selecionar arquivo</span>
                </label>
                {categoryImageName && (
                  <p className="text-xs text-gray-600">
                    Arquivo: {categoryImageName}
                  </p>
                )}
                {categoryImage && (
                  <img
                    src={getCategoryImagePreview(categoryImage)}
                    alt="Preview da categoria"
                    className="w-full max-h-40 object-cover rounded-md border border-gray-100"
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Cursos
            </label>
            <button
              type="button"
              onClick={() => setCategoryCourseModalOpen(true)}
              className="w-full border border-gray-200 rounded-xl p-4 text-left hover:border-gray-300"
            >
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-blue-600">
                  <Plus className="w-4 h-4" />
                </span>
                Inserir curso
              </div>
            </button>
            {loadingCourseOptions && (
              <p className="text-sm text-gray-500 mt-2">Carregando cursos...</p>
            )}
            {!loadingCourseOptions && courseOptions.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Nenhum curso disponivel.
              </p>
            )}
            {categoryCourses.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {categoryCourses.map((courseId) => {
                  const course = courseOptions.find(
                    (item) => item.id === courseId
                  );
                  return (
                    <span
                      key={courseId}
                      className="inline-flex items-center gap-2 px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                    >
                      {course?.nome || "Curso selecionado"}
                      <button
                        type="button"
                        onClick={() => toggleCategoryCourse(courseId)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {categoryError && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
              {categoryError}
            </div>
          )}

            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={resetCategoryForm}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={handleSaveCategory}
                disabled={categorySaving}
                className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg disabled:opacity-60"
              >
                {categorySaving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {categoryCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Inserir curso
              </h3>
              <button
                type="button"
                onClick={() => setCategoryCourseModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={categoryCourseSearch}
                onChange={(event) => setCategoryCourseSearch(event.target.value)}
                placeholder="Buscar por nome..."
                className="flex-1 min-w-[220px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                type="button"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
              >
                Buscar
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl max-h-72 overflow-y-auto">
              <div className="divide-y divide-gray-100">
                {filteredCourseOptions.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-gray-500">
                    Nenhum curso encontrado.
                  </p>
                ) : (
                  filteredCourseOptions.map((course) => {
                    const isSelected = categoryCourses.includes(course.id);
                    return (
                      <div
                        key={course.id}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <span className="text-sm text-gray-900">
                          {course.nome}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleCategoryCourse(course.id)}
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full border ${
                            isSelected
                              ? "border-gray-300 text-gray-300 cursor-not-allowed"
                              : "border-blue-600 text-blue-600"
                          }`}
                          disabled={isSelected}
                          title={isSelected ? "Adicionado" : "Adicionar"}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setCategoryCourseModalOpen(false)}
                className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg"
              >
                Pronto
              </button>
            </div>
          </div>
        </div>
      )}

      {categoryDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Remover categoria
              </h3>
              <button
                type="button"
                onClick={() => setCategoryDeleteTarget(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Tem certeza que deseja remover a categoria{" "}
              <span className="font-semibold text-gray-900">
                {categoryDeleteTarget.nome || "sem nome"}
              </span>
              ?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCategoryDeleteTarget(null)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600"
              >
                Nao
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = categoryDeleteTarget.id;
                  setCategoryDeleteTarget(null);
                  await handleDeleteCategory(id);
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg"
              >
                Sim, remover
              </button>
            </div>
          </div>
        </div>
      )}

      {formMode?.type === "assunto" &&
        renderForm(
          "Nome do assunto",
          formMode.value,
          (value) => setFormMode({ type: "assunto", value }),
          () => setFormMode(null),
          handleCreateAssunto,
          savingKey === "assunto-create"
        )}

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Carregando cursos...</div>
      ) : assuntos.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-600">
          Nenhum assunto cadastrado.
        </div>
      ) : (
        <div className="space-y-4">
          {assuntos.map((assunto) => {
            const assuntoName = getName(assunto);
            const assuntoId = assunto.id;
            const isExpanded = Boolean(expandedAssuntos[assuntoId]);
            return (
              <div
                key={assuntoId}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedAssuntos((prev) => ({
                        ...prev,
                        [assuntoId]: !isExpanded,
                      }))
                    }
                    className="flex items-center gap-2 text-left"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{assuntoName}</p>
                      <p className="text-xs text-gray-500">
                        {assunto.modulos?.length || 0} modulos
                      </p>
                    </div>
                  </button>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormMode({
                          type: "edit-assunto",
                          id: assuntoId,
                          value: assuntoName,
                        })
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border rounded-lg"
                    >
                      <Edit className="w-3 h-3" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormMode({
                          type: "modulo",
                          parentId: assuntoId,
                          value: "",
                        })
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border rounded-lg"
                    >
                      <Plus className="w-3 h-3" />
                      Modulo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAssunto(assuntoId)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border rounded-lg text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remover
                    </button>
                  </div>
                </div>

                {formMode?.type === "edit-assunto" &&
                  formMode.id === assuntoId &&
                  renderForm(
                    "Nome do assunto",
                    formMode.value,
                    (value) =>
                      setFormMode({ type: "edit-assunto", id: assuntoId, value }),
                    () => setFormMode(null),
                    handleUpdateAssunto,
                    savingKey === `assunto-update-${assuntoId}`
                  )}

                {formMode?.type === "modulo" &&
                  formMode.parentId === assuntoId &&
                  renderForm(
                    "Nome do modulo",
                    formMode.value,
                    (value) =>
                      setFormMode({
                        type: "modulo",
                        parentId: assuntoId,
                        value,
                      }),
                    () => setFormMode(null),
                    handleCreateModulo,
                    savingKey === `modulo-create-${assuntoId}`
                  )}

                {isExpanded && (
                  <div className="mt-4 space-y-3">
                    {(assunto.modulos || []).map((modulo) => {
                      const moduloName = getName(modulo);
                      const moduloId = modulo.id;
                      const moduloExpanded = Boolean(expandedModulos[moduloId]);
                      return (
                        <div
                          key={moduloId}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedModulos((prev) => ({
                                  ...prev,
                                  [moduloId]: !moduloExpanded,
                                }))
                              }
                              className="flex items-center gap-2 text-left"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  moduloExpanded ? "rotate-180" : ""
                                }`}
                              />
                              <div>
                                <p className="font-medium text-gray-800">
                                  {moduloName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {modulo.itens?.length || 0} itens
                                </p>
                              </div>
                            </button>
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setFormMode({
                                    type: "edit-modulo",
                                    id: moduloId,
                                    value: moduloName,
                                  })
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border rounded-lg"
                              >
                                <Edit className="w-3 h-3" />
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setFormMode({
                                    type: "item",
                                    parentId: moduloId,
                                    value: "",
                                  })
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border rounded-lg"
                              >
                                <Plus className="w-3 h-3" />
                                Item
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteModulo(moduloId)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border rounded-lg text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                                Remover
                              </button>
                            </div>
                          </div>

                          {formMode?.type === "edit-modulo" &&
                            formMode.id === moduloId &&
                            renderForm(
                              "Nome do modulo",
                              formMode.value,
                              (value) =>
                                setFormMode({
                                  type: "edit-modulo",
                                  id: moduloId,
                                  value,
                                }),
                              () => setFormMode(null),
                              handleUpdateModulo,
                              savingKey === `modulo-update-${moduloId}`
                            )}

                          {formMode?.type === "item" &&
                            formMode.parentId === moduloId &&
                            renderForm(
                              "Nome do item",
                              formMode.value,
                              (value) =>
                                setFormMode({
                                  type: "item",
                                  parentId: moduloId,
                                  value,
                                }),
                              () => setFormMode(null),
                              handleCreateItem,
                              savingKey === `item-create-${moduloId}`
                            )}

                          {moduloExpanded && (
                            <div className="mt-3 space-y-2">
                              {(modulo.itens || []).map((item) => {
                                const itemName = getName(item);
                                return (
                                  <div
                                    key={item.id}
                                    className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                                  >
                                    <p className="text-sm text-gray-800">
                                      {itemName}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setFormMode({
                                            type: "edit-item",
                                            id: item.id,
                                            parentId: moduloId,
                                            value: itemName,
                                          })
                                        }
                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs border rounded-lg"
                                      >
                                        <Edit className="w-3 h-3" />
                                        Editar
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteCourseItem(item.id)
                                        }
                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs border rounded-lg text-red-600"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                        Remover
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {formMode?.type === "edit-item" &&
                            moduloExpanded &&
                            formMode.parentId === moduloId &&
                            renderForm(
                              "Nome do item",
                              formMode.value,
                              (value) =>
                                setFormMode({
                                  type: "edit-item",
                                  id: formMode.id,
                                  parentId: formMode.parentId,
                                  value,
                                }),
                              () => setFormMode(null),
                              handleUpdateItem,
                              savingKey === `item-update-${formMode.id}`
                            )}
                        </div>
                      );
                    })}
                    {assunto.modulos?.length === 0 && (
                      <div className="text-sm text-gray-500">
                        Nenhum modulo cadastrado.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

const SettingsSection = () => (
  <section className="space-y-4">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Configuracoes</h2>
      <p className="text-gray-600">Altere informacoes gerais da plataforma</p>
    </div>
    <form className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Nome da plataforma
        </label>
        <input
          type="text"
          defaultValue="Pantheon Concursos"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Email de suporte
        </label>
        <input
          type="email"
          defaultValue="suporte@pantheon.com.br"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <button
        type="button"
        className="px-5 py-2 bg-orange-500 text-white rounded-lg"
      >
        Salvar
      </button>
    </form>
  </section>
);


type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const normalizeQuestionText = (value: string) => {
  if (!value) return "";
  const withBreaks = value.replace(/<br\s*\/?>/gi, "\n");
  const withoutTags = withBreaks.replace(/<\/?[^>]+>/g, "");
  return withoutTags.replace(/\r\n/g, "\n").trim();
};

const normalizeAnswer = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const normalized = trimmed.toLowerCase();
  if (["a", "b", "c", "d", "e"].includes(normalized)) {
    return normalized.toUpperCase();
  }
  const numeric = Number(trimmed);
  if (!Number.isNaN(numeric) && numeric >= 1 && numeric <= 5) {
    return String.fromCharCode(64 + numeric);
  }
  return trimmed;
};

const getString = (record: UnknownRecord, key: string) => {
  const value = record[key];
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  return "";
};

const getFirstString = (
  record: UnknownRecord,
  keys: string[],
  fallback = ""
) => {
  for (const key of keys) {
    const value = getString(record, key);
    if (value) return value;
  }
  return fallback;
};

const normalizeFilterValues = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === "string" ? entry : String(entry ?? "")))
      .map((entry) => entry.trim())
      .filter((entry) => Boolean(entry));
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => Boolean(entry));
  }
  return [];
};

const normalizeQuestionFilters = (payload: unknown): QuestionFilterOptions => {
  const fallback: QuestionFilterOptions = {
    disciplina: [],
    assunto: [],
    banca: [],
    orgao: [],
    cargo: [],
    concurso: [],
    area_conhecimento: [],
  };
  if (!isRecord(payload)) return fallback;

  return {
    disciplina: normalizeFilterValues(payload["disciplina"]),
    assunto: normalizeFilterValues(payload["assunto"]),
    banca: normalizeFilterValues(payload["banca"]),
    orgao: normalizeFilterValues(payload["orgao"]),
    cargo: normalizeFilterValues(payload["cargo"]),
    concurso: normalizeFilterValues(payload["concurso"]),
    area_conhecimento: normalizeFilterValues(payload["area_conhecimento"]),
  };
};

const normalizeQuestionRecord = (
  item: unknown,
  index: number
): AdminQuestion => {
  const record: UnknownRecord = isRecord(item) ? item : {};
  return {
    id: getFirstString(
      record,
      ["id", "uuid", "id_questao", "idQuestao"],
      String(index + 1)
    ),
    enunciado:
      normalizeQuestionText(
        getFirstString(record, [
          "enunciado",
          "enunciado_questao",
          "texto",
          "pergunta",
          "questao",
          "questao_texto",
          "html_completo",
          "htmlCompleto",
        ])
      ) || "Enunciado nao informado.",
    alternativa_a: normalizeQuestionText(
      getFirstString(record, ["alternativa_a", "alternativaA"])
    ),
    alternativa_b: normalizeQuestionText(
      getFirstString(record, ["alternativa_b", "alternativaB"])
    ),
    alternativa_c: normalizeQuestionText(
      getFirstString(record, ["alternativa_c", "alternativaC"])
    ),
    alternativa_d: normalizeQuestionText(
      getFirstString(record, ["alternativa_d", "alternativaD"])
    ),
    alternativa_e: normalizeQuestionText(
      getFirstString(record, ["alternativa_e", "alternativaE"])
    ),
    resposta_correta: normalizeAnswer(
      getFirstString(record, [
        "resposta_correta",
        "respostaCorreta",
        "gabarito",
        "alternativa_correta",
        "alternativaCorreta",
        "numero_alternativa_correta",
        "numeroAlternativaCorreta",
      ])
    ),
    disciplina: getFirstString(record, ["disciplina"]),
    assunto: getFirstString(record, ["assunto", "tema", "topico"]),
    banca: getFirstString(record, ["banca"]),
    orgao: getFirstString(record, ["orgao"]),
    cargo: getFirstString(record, ["cargo"]),
    concurso: getFirstString(record, ["concurso", "ano"]),
    area_conhecimento: getFirstString(record, [
      "area_conhecimento",
      "areaConhecimento",
      "disciplina",
    ]),
  };
};

const normalizeQuestionCollection = (payload: unknown): AdminQuestion[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload.map((item, index) => normalizeQuestionRecord(item, index));
  }
  if (!isRecord(payload)) return [];

  const itemsCandidate = payload["items"];
  if (Array.isArray(itemsCandidate)) {
    return itemsCandidate.map((item, index) =>
      normalizeQuestionRecord(item, index)
    );
  }

  const dataCandidate = payload["data"];
  if (Array.isArray(dataCandidate)) {
    return dataCandidate.map((item, index) =>
      normalizeQuestionRecord(item, index)
    );
  }

  return [];
};

const normalizeQuestionsCount = (payload: unknown) => {
  if (typeof payload === "number" && Number.isFinite(payload)) {
    return Math.max(0, Math.trunc(payload));
  }
  if (isRecord(payload)) {
    const candidates = [
      "count",
      "total",
      "quantidade",
      "total_questoes",
      "totalQuestoes",
      "questoes",
      "contador",
    ];
    for (const key of candidates) {
      const value = payload[key];
      if (typeof value === "number" && Number.isFinite(value)) {
        return Math.max(0, Math.trunc(value));
      }
      if (typeof value === "string") {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) {
          return Math.max(0, Math.trunc(parsed));
        }
      }
    }
  }
  return 0;
};

export default AdminDashboard;
