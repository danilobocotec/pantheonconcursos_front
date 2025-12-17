import React from "react";
import { buildApiUrl } from "@/lib/api";
import {
  LayoutDashboard,
  Users,
  Scale,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  Plus,
  Upload,
  Edit,
  Trash2,
  Clock,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

type AdminDashboardProps = {
  onNavigate?: (page: string) => void;
};

type SidebarItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

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
  status: string;
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

type VadeMecumFormData = {
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
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "vade", label: "Vade Mecum", icon: Scale },
  { id: "users", label: "Usuarios", icon: Users },
  { id: "settings", label: "Configuracoes", icon: Settings },
];

const DEFAULT_FORM: VadeMecumFormData = {
  nomecodigo: "",
  cabecalho: "",
  parte: "",
  idlivro: "",
  livro: "",
  livrotexto: "",
  idtitulo: "",
  titulo: "",
  titulotexto: "",
  idsubtitulo: "",
  subtitulo: "",
  subtitulotexto: "",
  idcapitulo: "",
  capitulo: "",
  capitulotexto: "",
  idsecao: "",
  secao: "",
  secaotexto: "",
  idsubsecao: "",
  subsecao: "",
  subsecaotexto: "",
  num_artigo: "",
  normativo: "",
  ordem: "",
};

const TOKEN_KEY = "pantheon:token";
const VADE_API_URL = buildApiUrl("/vade-mecum/codigos");
const VADE_IMPORT_URL = `${VADE_API_URL}/import`;

const AdminDashboard = ({ onNavigate }: AdminDashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [section, setSection] = React.useState("dashboard");

  const renderSection = () => {
    switch (section) {
      case "vade":
        return <VadeMecumSection />;
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

const DashboardSection = () => (
  <section className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
      <p className="text-gray-600">Resumo rapido da plataforma</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { label: "Alunos ativos", value: "10.234" },
        { label: "Receita mensal", value: "R$ 482K" },
        { label: "Taxa de aprovacao", value: "87%" },
      ].map((card) => (
        <div
          key={card.label}
          className="bg-white border border-gray-200 rounded-xl p-5"
        >
          <p className="text-sm text-gray-500">{card.label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
        </div>
      ))}
    </div>
  </section>
);

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

const VadeMecumSection = () => {
  const [codes, setCodes] = React.useState<VadeMecumCode[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [importError, setImportError] = React.useState<string | null>(null);
  const [importSuccess, setImportSuccess] = React.useState<string | null>(null);
  const [importing, setImporting] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [formData, setFormData] =
    React.useState<VadeMecumFormData>(DEFAULT_FORM);
  const [saving, setSaving] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [selectedGroupKey, setSelectedGroupKey] = React.useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const [articleQuery, setArticleQuery] = React.useState("");
  const [sectionFilter, setSectionFilter] = React.useState<string | null>(null);
  const [focusedArticleId, setFocusedArticleId] = React.useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = React.useState<"all" | "grouped">("all");
  const importInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFieldChange = React.useCallback(
    (field: keyof VadeMecumFormData, value: string) => {
      setFormData((previous) => ({ ...previous, [field]: value }));
    },
    []
  );

  const summaryCards = React.useMemo(() => {
    const distinct = (values: string[]) =>
      new Set(values.filter((value) => Boolean(value))).size;
    return [
      { label: "Total", value: codes.length },
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
    () => groupedCodes.find((group) => group.key === selectedGroupKey) || null,
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

  const filteredCodes = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return codes;
    return codes.filter((code) => {
      const haystack = [
        code.nomecodigo,
        code.cabecalho,
        code.num_artigo,
        code.normativo,
        code.secao,
        code.subsecao,
        code.livrotexto,
        code.titulotexto,
        code.subtitulotexto,
        code.capitulotexto,
      ]
        .filter((value) => Boolean(value))
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [codes, searchTerm]);

  const sortedFilteredCodes = React.useMemo(() => {
    return [...filteredCodes].sort((a, b) => {
      const byCode = (a.nomecodigo || "").localeCompare(
        b.nomecodigo || "",
        "pt-BR"
      );
      if (byCode !== 0) return byCode;
      return (a.num_artigo || "").localeCompare(b.num_artigo || "", "pt-BR");
    });
  }, [filteredCodes]);

  const handleArticleSelect = React.useCallback((articleId: string) => {
    setFocusedArticleId(articleId);
    if (typeof document !== "undefined") {
      const target = document.getElementById(`article-${articleId}`);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const openGroup = (groupKey: string) => {
    setSelectedGroupKey(groupKey);
    setArticleQuery("");
    setSectionFilter(null);
    setFocusedArticleId(null);
  };

  const resetDetail = () => {
    setSelectedGroupKey(null);
    setArticleQuery("");
    setSectionFilter(null);
    setFocusedArticleId(null);
  };

  const highlightArticle = articles[0];

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

      let response = await fetch(VADE_API_URL, { headers });
      if ((response.status === 401 || response.status === 403) && token) {
        const fallbackHeaders: Record<string, string> = {
          Accept: "application/json",
        };
        response = await fetch(VADE_API_URL, { headers: fallbackHeaders });
      }
      if (!response.ok)
        throw new Error(`Falha ao carregar registros (${response.status})`);
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

  const uploadExcel = React.useCallback(
    async (file: File) => {
      setImporting(true);
      setImportError(null);
      setImportSuccess(null);
      try {
        const headers: Record<string, string> = { Accept: "application/json" };
        const token =
          typeof window !== "undefined"
            ? window.localStorage.getItem(TOKEN_KEY)
            : null;
        if (token) headers.Authorization = `Bearer ${token}`;

        const formDataPayload = new FormData();
        formDataPayload.append("file", file, file.name);

        const response = await fetch(VADE_IMPORT_URL, {
          method: "POST",
          headers,
          body: formDataPayload,
        });

        if (!response.ok) {
          const json = await safeJson(response.clone());
          const text = await response.text().catch(() => "");
          throw new Error(
            json?.message ||
              text ||
              `Falha ao importar planilha (${response.status})`
          );
        }

        const json = await safeJson(response.clone());
        setImportSuccess(json?.message || "Planilha importada com sucesso.");
        await loadCodes();
      } catch (uploadError) {
        setImportError(
          uploadError instanceof Error
            ? uploadError.message
            : "Erro ao importar planilha."
        );
      } finally {
        if (importInputRef.current) importInputRef.current.value = "";
        setImporting(false);
      }
    },
    [loadCodes]
  );

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    void uploadExcel(file);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormData(DEFAULT_FORM);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem(TOKEN_KEY)
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;
      const url = editingId ? `${VADE_API_URL}/${editingId}` : VADE_API_URL;
      const method = editingId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(buildPayload(formData)),
      });
      if (!response.ok) {
        const body = await safeJson(response);
        throw new Error(body?.message || "Falha ao salvar registro.");
      }
      await loadCodes();
      closeForm();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Erro ao salvar."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Remover este codigo?")
    )
      return;
    setDeletingId(id);
    setError(null);
    try {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem(TOKEN_KEY)
          : null;
      const headers: Record<string, string> = { Accept: "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(`${VADE_API_URL}/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) {
        const body = await safeJson(response);
        throw new Error(body?.message || "Falha ao remover registro.");
      }
      await loadCodes();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Erro ao remover."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const startCreate = () => {
    setFormOpen(true);
    setFormData(DEFAULT_FORM);
    setEditingId(null);
  };

  const startEdit = (code: VadeMecumCode) => {
    setFormOpen(true);
    setEditingId(code.id);
    setFormData({
      nomecodigo: code.nomecodigo,
      cabecalho: code.cabecalho,
      parte: code.parte,
      idlivro: code.idlivro,
      livro: code.livro,
      livrotexto: code.livrotexto,
      idtitulo: code.idtitulo,
      titulo: code.titulo,
      titulotexto: code.titulotexto,
      idsubtitulo: code.idsubtitulo,
      subtitulo: code.subtitulo,
      subtitulotexto: code.subtitulotexto,
      idcapitulo: code.idcapitulo,
      capitulo: code.capitulo,
      capitulotexto: code.capitulotexto,
      idsecao: code.idsecao,
      secao: code.secao,
      secaotexto: code.secaotexto,
      idsubsecao: code.idsubsecao,
      subsecao: code.subsecao,
      subsecaotexto: code.subsecaotexto,
      num_artigo: code.num_artigo,
      normativo: code.normativo,
      ordem: code.ordem,
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Vade Mecum Digital
          </h2>
          <p className="text-gray-600">
            Visualize e gerencie os codigos oficiais
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            ref={importInputRef}
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            className="hidden"
            onChange={handleImportChange}
          />
          <button
            type="button"
            onClick={handleImportClick}
            disabled={importing}
            className="px-5 py-2 border border-gray-200 rounded-lg flex items-center gap-2 disabled:opacity-60"
            title="Importar planilha Excel (.xlsx)"
          >
            <Upload className="w-4 h-4" />
            {importing ? "Importando..." : "Importar Excel"}
          </button>
          <button
            onClick={startCreate}
            className="px-5 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo registro
          </button>
          <button
            onClick={loadCodes}
            className="px-5 py-2 border border-gray-200 rounded-lg"
          >
            Atualizar
          </button>
        </div>
      </div>

      {(importError || importSuccess) && (
        <div
          className={`border rounded-xl p-4 ${
            importError
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-green-50 border-green-200 text-green-800"
          }`}
        >
          <p className="text-sm font-semibold">
            {importError ? importError : importSuccess}
          </p>
          <p className="text-xs mt-1 opacity-80">Endpoint: {VADE_IMPORT_URL}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-gray-200 rounded-xl p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{card.label}</p>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {!selectedGroupKey && (
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por codigo, cabecalho, artigo, secao..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode("all")}
                className={`px-3 py-2 text-sm rounded-lg border ${
                  viewMode === "all"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grouped")}
                className={`px-3 py-2 text-sm rounded-lg border ${
                  viewMode === "grouped"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Agrupado
              </button>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          {viewMode === "all" ? (
            <div className="p-4 space-y-3">
              {loading &&
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-20 border border-dashed border-gray-200 rounded-xl animate-pulse bg-gray-50"
                  />
                ))}

              {!loading && sortedFilteredCodes.length === 0 && (
                <p className="text-center text-gray-500 border border-dashed border-gray-200 rounded-xl py-10">
                  Nenhum codigo encontrado. Ajuste a busca ou cadastre um novo
                  registro.
                </p>
              )}

              {!loading &&
                sortedFilteredCodes.map((code) => (
                  <div
                    key={code.id}
                    className="border border-gray-200 rounded-xl p-4 bg-white"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-[220px]">
                        <p className="text-xs font-semibold text-orange-600">
                          {code.nomecodigo || "Codigo"}
                          {code.num_artigo ? ` • Art. ${code.num_artigo}` : ""}
                        </p>
                        <p className="text-base font-bold text-gray-900 mt-1">
                          {code.cabecalho || "-"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {code.secaotexto || code.secao
                            ? `Secao: ${code.secaotexto || code.secao}`
                            : "Secao: -"}{" "}
                          •{" "}
                          {code.updatedAt
                            ? `Atualizado ${formatDate(code.updatedAt)}`
                            : "Sem data"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(code)}
                          className="px-3 py-1 text-sm text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(code.id)}
                          disabled={deletingId === code.id}
                          className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === code.id ? "Removendo..." : "Remover"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {loading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-24 border border-dashed border-gray-200 rounded-xl animate-pulse bg-gray-50"
                  />
                ))}
              {!loading && filteredGroups.length === 0 && (
                <p className="col-span-full text-center text-gray-500 border border-dashed border-gray-200 rounded-xl py-10">
                  Nenhum codigo encontrado. Ajuste a busca ou cadastre um novo
                  registro.
                </p>
              )}
              {!loading &&
                filteredGroups.map((group) => (
                  <button
                    key={group.key}
                    onClick={() => openGroup(group.key)}
                    className="text-left border border-orange-200 rounded-xl p-4 hover:border-orange-500 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    <p className="font-semibold text-gray-900">
                      {group.label || "Codigo sem titulo"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {group.description || "Sem descricao cadastrada."}
                    </p>
                    {(group.updatedAt || group.createdAt) && (
                      <p className="text-xs text-gray-400 mt-2">
                        Atualizado em{" "}
                        {formatDate(group.updatedAt || group.createdAt || "-")}
                      </p>
                    )}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {selectedGroupKey && currentGroup && (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <button
              type="button"
              onClick={resetDetail}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para listagem
            </button>

            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {currentGroup.label}
                </p>
                <p className="text-gray-600">
                  {currentGroup.description || "Sem cabecalho cadastrado."}
                </p>
              </div>
              {highlightArticle && (
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  {[
                    { label: "Parte", value: highlightArticle.parte || "-" },
                    {
                      label: "Livro",
                      value:
                        highlightArticle.livrotexto ||
                        highlightArticle.livro ||
                        "-",
                    },
                    {
                      label: "Titulo",
                      value:
                        highlightArticle.titulotexto ||
                        highlightArticle.titulo ||
                        "-",
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
                      value:
                        highlightArticle.secaotexto ||
                        highlightArticle.secao ||
                        "-",
                    },
                    {
                      label: "Normativo",
                      value: highlightArticle.normativo || "-",
                    },
                    { label: "Ordem", value: highlightArticle.ordem || "-" },
                  ].map((item) => (
                    <div key={item.label}>
                      <dt className="font-semibold text-gray-900">
                        {item.label}
                      </dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            <div className="space-y-4">
              {filteredArticles.length === 0 && (
                <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-500">
                  Nenhum artigo corresponde aos filtros selecionados.
                </div>
              )}
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  id={`article-${article.id}`}
                  className={`bg-white border rounded-xl p-4 ${
                    focusedArticleId === article.id
                      ? "ring-2 ring-orange-500"
                      : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-orange-600">
                        Art. {article.num_artigo || "-"}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {article.cabecalho || currentGroup.label}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(article)}
                        className="px-3 py-1 text-sm text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        disabled={deletingId === article.id}
                        className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === article.id ? "Removendo..." : "Remover"}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-semibold">Livro:</span>{" "}
                      {article.livrotexto || article.livro || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Titulo:</span>{" "}
                      {article.titulotexto || article.titulo || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Subtitulo:</span>{" "}
                      {article.subtitulotexto || article.subtitulo || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Capitulo:</span>{" "}
                      {article.capitulotexto || article.capitulo || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Secao:</span>{" "}
                      {article.secaotexto || article.secao || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Subseccao:</span>{" "}
                      {article.subsecaotexto || article.subsecao || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Atualizado em:</span>{" "}
                      {article.updatedAt ? formatDate(article.updatedAt) : "-"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="w-full lg:w-72 bg-white border border-gray-200 rounded-xl flex flex-col max-h-[720px]">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar artigo (ex: 1230 ou 12)"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                  value={articleQuery}
                  onChange={(event) => setArticleQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {sectionEntries.map(([sectionName, sectionArticles]) => {
                const isActive = sectionFilter === sectionName;
                return (
                  <div key={sectionName} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase text-gray-500">
                        {sectionName}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setSectionFilter(isActive ? null : sectionName)
                        }
                        className="text-xs text-orange-600 hover:underline"
                      >
                        {isActive ? "Limpar" : "Filtrar"}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {sectionArticles
                        .filter((article) => matchesArticleQuery(article))
                        .map((article) => (
                          <button
                            key={article.id}
                            type="button"
                            onClick={() => handleArticleSelect(article.id)}
                            className={`text-xs border rounded-lg py-1 ${
                              focusedArticleId === article.id
                                ? "bg-orange-500 text-white"
                                : "hover:bg-orange-50"
                            }`}
                          >
                            Art. {article.num_artigo || "-"}
                          </button>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      )}

      {formOpen && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xl font-bold text-gray-900">
                {editingId ? "Editar codigo" : "Novo codigo"}
              </p>
              <p className="text-sm text-gray-600">
                Os dados serao salvos via API oficial
              </p>
            </div>
            <button
              onClick={closeForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={handleSubmit}
          >
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome do codigo
              </label>
              <input
                required
                type="text"
                value={formData.nomecodigo}
                onChange={(event) =>
                  handleFieldChange("nomecodigo", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Cabecalho
              </label>
              <textarea
                rows={3}
                value={formData.cabecalho}
                onChange={(event) =>
                  handleFieldChange("cabecalho", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Parte
              </label>
              <input
                type="text"
                value={formData.parte}
                onChange={(event) =>
                  handleFieldChange("parte", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Normativo
              </label>
              <input
                type="text"
                value={formData.normativo}
                onChange={(event) =>
                  handleFieldChange("normativo", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Ordem
              </label>
              <input
                type="text"
                value={formData.ordem}
                onChange={(event) =>
                  handleFieldChange("ordem", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Numero do artigo
              </label>
              <input
                type="text"
                value={formData.num_artigo}
                onChange={(event) =>
                  handleFieldChange("num_artigo", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2 pt-4">
              <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Livro
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                ID do livro
              </label>
              <input
                type="text"
                value={formData.idlivro}
                onChange={(event) =>
                  handleFieldChange("idlivro", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome do livro
              </label>
              <input
                type="text"
                value={formData.livro}
                onChange={(event) =>
                  handleFieldChange("livro", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Texto do livro
              </label>
              <textarea
                rows={2}
                value={formData.livrotexto}
                onChange={(event) =>
                  handleFieldChange("livrotexto", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2 pt-4">
              <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Titulo
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                ID do titulo
              </label>
              <input
                type="text"
                value={formData.idtitulo}
                onChange={(event) =>
                  handleFieldChange("idtitulo", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome do titulo
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(event) =>
                  handleFieldChange("titulo", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Texto do titulo
              </label>
              <textarea
                rows={2}
                value={formData.titulotexto}
                onChange={(event) =>
                  handleFieldChange("titulotexto", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2 pt-4">
              <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Subtitulo
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                ID do subtitulo
              </label>
              <input
                type="text"
                value={formData.idsubtitulo}
                onChange={(event) =>
                  handleFieldChange("idsubtitulo", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome do subtitulo
              </label>
              <input
                type="text"
                value={formData.subtitulo}
                onChange={(event) =>
                  handleFieldChange("subtitulo", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Texto do subtitulo
              </label>
              <textarea
                rows={2}
                value={formData.subtitulotexto}
                onChange={(event) =>
                  handleFieldChange("subtitulotexto", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2 pt-4">
              <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Capitulo
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                ID do capitulo
              </label>
              <input
                type="text"
                value={formData.idcapitulo}
                onChange={(event) =>
                  handleFieldChange("idcapitulo", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome do capitulo
              </label>
              <input
                type="text"
                value={formData.capitulo}
                onChange={(event) =>
                  handleFieldChange("capitulo", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Texto do capitulo
              </label>
              <textarea
                rows={2}
                value={formData.capitulotexto}
                onChange={(event) =>
                  handleFieldChange("capitulotexto", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2 pt-4">
              <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Secao
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                ID da secao
              </label>
              <input
                type="text"
                value={formData.idsecao}
                onChange={(event) =>
                  handleFieldChange("idsecao", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome da secao
              </label>
              <input
                type="text"
                value={formData.secao}
                onChange={(event) =>
                  handleFieldChange("secao", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Texto da secao
              </label>
              <textarea
                rows={2}
                value={formData.secaotexto}
                onChange={(event) =>
                  handleFieldChange("secaotexto", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2 pt-4">
              <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Subseccao
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                ID da subseccao
              </label>
              <input
                type="text"
                value={formData.idsubsecao}
                onChange={(event) =>
                  handleFieldChange("idsubsecao", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome da subseccao
              </label>
              <input
                type="text"
                value={formData.subsecao}
                onChange={(event) =>
                  handleFieldChange("subsecao", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Texto da subseccao
              </label>
              <textarea
                rows={2}
                value={formData.subsecaotexto}
                onChange={(event) =>
                  handleFieldChange("subsecaotexto", event.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

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

const normalizeRecord = (item: unknown, index: number): VadeMecumCode => {
  const record: UnknownRecord = isRecord(item) ? item : {};
  return {
    id: getFirstString(record, ["id", "uuid"], String(index)),
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
    status: getFirstString(record, ["status"], "ativo"),
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

const buildPayload = (form: VadeMecumFormData) => ({
  Normativo: form.normativo,
  Ordem: form.ordem,
  PARTE: form.parte,
  parte: form.parte,
  cabecalho: form.cabecalho,
  capitulo: form.capitulo,
  capitulotexto: form.capitulotexto,
  idcapitulo: form.idcapitulo,
  idlivro: form.idlivro,
  idsecao: form.idsecao,
  idsubsecao: form.idsubsecao,
  idsubtitulo: form.idsubtitulo,
  idtitulo: form.idtitulo,
  livro: form.livro,
  livrotexto: form.livrotexto,
  nomecodigo: form.nomecodigo,
  num_artigo: form.num_artigo,
  secao: form.secao,
  secaotexto: form.secaotexto,
  subsecao: form.subsecao,
  subsecaotexto: form.subsecaotexto,
  subtitulo: form.subtitulo,
  subtitulotexto: form.subtitulotexto,
  titulo: form.titulo,
  titulotexto: form.titulotexto,
});

const safeJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
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

export default AdminDashboard;
