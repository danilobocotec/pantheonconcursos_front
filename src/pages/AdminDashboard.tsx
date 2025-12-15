import React from "react";
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
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  DEFAULT_VADE_PRIORITY,
  loadVadePriority,
  saveVadePriority,
} from "../constants/vadeMecum";

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
const VADE_API_URL = "http://localhost:8080/api/v1/vade-mecum/codigos";
const VADE_IMPORT_URL = `${VADE_API_URL}/import`;
const PRIORITY_LIMIT = DEFAULT_VADE_PRIORITY.length;

const AdminDashboard = ({ onNavigate }: AdminDashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [section, setSection] = React.useState<string>("dashboard");

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
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
      {[{ label: "Alunos ativos", value: "10.234" }, { label: "Receita mensal", value: "R$ 482K" }, { label: "Taxa de aprovacao", value: "87%" }].map(
        (card) => (
          <div
            key={card.label}
            className="bg-white border border-gray-200 rounded-xl p-5"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
          </div>
        )
      )}
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

const VadeMecumSection = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [codes, setCodes] = React.useState<VadeMecumCode[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState<boolean>(false);
  const [editingCode, setEditingCode] = React.useState<VadeMecumCode | null>(null);
  const [formData, setFormData] = React.useState<VadeMecumFormData>(DEFAULT_FORM);
  const [priorityOrder, setPriorityOrder] = React.useState<string[]>(() =>
    loadVadePriority().slice(0, PRIORITY_LIMIT)
  );
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const getToken = React.useCallback(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  }, []);

  const toHeaders = React.useCallback(() => {
    const token = getToken();
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }
    return headers;
  }, [getToken]);

  const showMessage = React.useCallback((type: "success" | "error", message: string) => {
    setFeedback({ type, message });
  }, []);

  const fetchCodes = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(VADE_API_URL, {
        headers: toHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Falha ao carregar codigos (${response.status})`);
      }
      const payload = await safeJson<{ data?: unknown; content?: unknown; items?: unknown }>(
        response
      );
      const collection = normalizeCollection(payload);
      setCodes(collection);
      setSelectedGroup((prev) => {
        if (prev) return prev;
        if (collection.length === 0) return prev;
        return collection[0]?.livro || "geral";
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Erro inesperado ao carregar codigos");
    } finally {
      setLoading(false);
    }
  }, [toHeaders]);

  React.useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  React.useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 4000);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  React.useEffect(() => {
    const handler = () => {
      setPriorityOrder(loadVadePriority().slice(0, PRIORITY_LIMIT));
    };
    if (typeof window !== "undefined") {
      window.addEventListener("pantheon-vade-priority-changed", handler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("pantheon-vade-priority-changed", handler);
      }
    };
  }, []);

  const handleMove = React.useCallback(
    (index: number, direction: -1 | 1) => {
      setPriorityOrder((current) => {
        const next = [...current];
        const target = index + direction;
        if (target < 0 || target >= next.length) return current;
        [next[index], next[target]] = [next[target], next[index]];
        saveVadePriority(next);
        showMessage("success", "Prioridade atualizada");
        return next;
      });
    },
    [showMessage]
  );

  const handleResetPriority = React.useCallback(() => {
    const restored = DEFAULT_VADE_PRIORITY.slice(0, PRIORITY_LIMIT);
    setPriorityOrder(restored);
    saveVadePriority(restored);
    showMessage("success", "Prioridade restaurada");
  }, [showMessage]);

  const handleFormChange = React.useCallback(
    (field: keyof VadeMecumFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleCreate = React.useCallback(() => {
    setShowForm(true);
    setEditingCode(null);
    setFormData(DEFAULT_FORM);
  }, []);

  const handleEdit = React.useCallback((code: VadeMecumCode) => {
    setEditingCode(code);
    setShowForm(true);
    setFormData({
      nomecodigo: code.nomecodigo || "",
      cabecalho: code.cabecalho || "",
      parte: code.parte || "",
      idlivro: code.idlivro || "",
      livro: code.livro || "",
      livrotexto: code.livrotexto || "",
      idtitulo: code.idtitulo || "",
      titulo: code.titulo || "",
      titulotexto: code.titulotexto || "",
      idsubtitulo: code.idsubtitulo || "",
      subtitulo: code.subtitulo || "",
      subtitulotexto: code.subtitulotexto || "",
      idcapitulo: code.idcapitulo || "",
      capitulo: code.capitulo || "",
      capitulotexto: code.capitulotexto || "",
      idsecao: code.idsecao || "",
      secao: code.secao || "",
      secaotexto: code.secaotexto || "",
      idsubsecao: code.idsubsecao || "",
      subsecao: code.subsecao || "",
      subsecaotexto: code.subsecaotexto || "",
      num_artigo: code.num_artigo || "",
      normativo: code.normativo || "",
      ordem: code.ordem || "",
    });
  }, []);

  const handleDelete = React.useCallback(
    async (code: VadeMecumCode) => {
      const confirmed = window.confirm(
        `Remover o codigo "${code.nomecodigo}"? Essa acao nao pode ser desfeita.`
      );
      if (!confirmed) return;
      try {
        const response = await fetch(`${VADE_API_URL}/${code.id}`, {
          method: "DELETE",
          headers: toHeaders(),
        });
        if (!response.ok) {
          throw new Error(`Falha ao remover codigo (${response.status})`);
        }
        showMessage("success", "Codigo removido com sucesso");
        fetchCodes();
      } catch (err) {
        console.error(err);
        showMessage("error", err instanceof Error ? err.message : "Erro ao remover codigo");
      }
    },
    [fetchCodes, showMessage, toHeaders]
  );

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const payload = buildPayload(formData);
      const url = editingCode ? `${VADE_API_URL}/${editingCode.id}` : VADE_API_URL;
      const method = editingCode ? "PUT" : "POST";
      try {
        const response = await fetch(url, {
          method,
          headers: toHeaders(),
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error(`Falha ao salvar codigo (${response.status})`);
        }
        showMessage("success", "Codigo salvo com sucesso");
        setShowForm(false);
        setEditingCode(null);
        setFormData(DEFAULT_FORM);
        fetchCodes();
      } catch (err) {
        console.error(err);
        showMessage(
          "error",
          err instanceof Error ? err.message : "Erro inesperado ao salvar codigo"
        );
      }
    },
    [editingCode, fetchCodes, formData, showMessage, toHeaders]
  );

  const handleImportClick = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImport = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const token = getToken();
      const form = new FormData();
      form.append("file", file);
      try {
        const response = await fetch(VADE_IMPORT_URL, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: form,
        });
        if (!response.ok) {
          throw new Error(`Falha ao importar arquivo (${response.status})`);
        }
        showMessage("success", "Arquivo importado com sucesso");
        fetchCodes();
      } catch (err) {
        console.error(err);
        showMessage("error", err instanceof Error ? err.message : "Erro ao importar arquivo");
      } finally {
        event.target.value = "";
      }
    },
    [fetchCodes, getToken, showMessage]
  );

  const groups = React.useMemo<VadeMecumGroup[]>(() => {
    const map = new Map<string, VadeMecumGroup>();
    codes.forEach((code) => {
      const key = code.livro || "geral";
      const label = code.livro || "Documentos";
      if (!map.has(key)) {
        map.set(key, {
          key,
          label,
          description: code.cabecalho || "Agrupado automaticamente",
          codes: [],
          createdAt: code.createdAt,
          updatedAt: code.updatedAt,
        });
      }
      map.get(key)?.codes.push(code);
    });
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [codes]);

  const filteredCodes = React.useMemo(() => {
    let filtered = codes;
    if (selectedGroup) {
      filtered = filtered.filter((code) => (code.livro || "geral") === selectedGroup);
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((code) =>
        statusFilter === "active" ? code.status === "ATIVO" : code.status !== "ATIVO"
      );
    }
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((code) =>
        [
          code.nomecodigo,
          code.normativo,
          code.titulo,
          code.livro,
          code.capitulo,
          code.num_artigo,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term))
      );
    }
    return filtered;
  }, [codes, searchTerm, selectedGroup, statusFilter]);

  const priorityCards = React.useMemo(() => {
    return priorityOrder.slice(0, PRIORITY_LIMIT).map((title) => {
      const match = codes.find((code) => code.nomecodigo === title);
      return {
        title,
        subtitle: match?.normativo || "Definido manualmente",
        updatedAt: match?.updatedAt,
      };
    });
  }, [codes, priorityOrder]);

  const selectedGroupData = React.useMemo(() => {
    if (!selectedGroup) return null;
    return groups.find((group) => group.key === selectedGroup) ?? null;
  }, [groups, selectedGroup]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Vade Mecum</h2>
            <p className="text-gray-600">
              Gerencie codigos normativos e a ordem de destaque exibida no portal publico.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg shadow-sm hover:bg-orange-600"
            >
              <Plus className="w-4 h-4" />
              Novo codigo
            </button>
            <button
              type="button"
              onClick={handleImportClick}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Upload className="w-4 h-4" />
              Importar XLSX
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </div>
        {feedback && (
          <div
            className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Total de codigos</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-2xl font-semibold text-gray-900">{codes.length}</p>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Grupos catalogados</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-2xl font-semibold text-gray-900">{groups.length}</p>
            <Scale className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Prioridade editavel</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-2xl font-semibold text-gray-900">{PRIORITY_LIMIT}</p>
            <RotateCcw className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 md:hidden">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCreate}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg shadow-sm hover:bg-orange-600"
              >
                <Plus className="w-4 h-4" />
                Novo codigo
              </button>
              <button
                type="button"
                onClick={handleImportClick}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Upload className="w-4 h-4" />
                Importar XLSX
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar por titulo, artigo ou palavra-chave"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
                    statusFilter === "all"
                      ? "border-orange-500 text-orange-600 bg-orange-50"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("active")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
                    statusFilter === "active"
                      ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  Ativos
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("inactive")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
                    statusFilter === "inactive"
                      ? "border-gray-500 text-gray-700 bg-gray-100"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  Inativos
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {groups.map((group) => {
                const active = selectedGroup === group.key;
                return (
                  <button
                    key={group.key}
                    type="button"
                    onClick={() => setSelectedGroup(group.key)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                      active
                        ? "border-orange-500 text-orange-600 bg-orange-50"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {group.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Codigo</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Livro</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Artigo</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Atualizacao</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Acoes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                        Carregando codigos...
                      </td>
                    </tr>
                  )}

                  {!loading && error && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-red-600">
                        {error}
                      </td>
                    </tr>
                  )}

                  {!loading && !error && filteredCodes.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                        Nenhum codigo encontrado com os filtros atuais.
                      </td>
                    </tr>
                  )}

                  {!loading && !error &&
                    filteredCodes.map((code) => {
                      const active = priorityOrder.includes(code.nomecodigo);
                      return (
                        <tr key={code.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">
                                {code.nomecodigo || "Sem titulo"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {code.normativo || "Sem descricao"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{code.livro || "-"}</td>
                          <td className="px-4 py-3 text-gray-600">{code.num_artigo || "-"}</td>
                          <td className="px-4 py-3 text-gray-600">
                            {code.updatedAt ? formatDate(code.updatedAt) : "-"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleEdit(code)}
                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(code)}
                                className="p-2 rounded-lg border border-gray-200 text-red-600 hover:border-red-300"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                                  active
                                    ? "border-orange-500 text-orange-600 bg-orange-50"
                                    : "border-gray-200 text-gray-500"
                                }`}
                              >
                                {active ? "Prioritario" : "Catalogado"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Prioridade</h3>
              <button
                type="button"
                onClick={handleResetPriority}
                className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                <RotateCcw className="w-4 h-4" />
                Restaurar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use os controles para reordenar os nove destaques exibidos na pagina publica.
            </p>

            <div className="mt-4 space-y-3">
              {priorityCards.map((card, index) => (
                <div
                  key={`${card.title}-${index}`}
                  className="border border-gray-200 rounded-lg p-3 flex items-start justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-semibold text-gray-500">#{index + 1}</p>
                    <p className="text-sm font-semibold text-gray-900">{card.title}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {card.subtitle || "Definido manualmente"}
                    </p>
                    {card.updatedAt && (
                      <p className="text-[11px] text-gray-400 mt-1">
                        Atualizado em {formatDate(card.updatedAt)}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => handleMove(index, -1)}
                      className="p-1 rounded border border-gray-200 text-gray-600 hover:border-gray-300"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 1)}
                      className="p-1 rounded border border-gray-200 text-gray-600 hover:border-gray-300"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900">Resumo do grupo</h3>
            <p className="text-xs text-gray-500 mt-1">
              Selecione um grupo para visualizar informacoes basicas.
            </p>
            {selectedGroup ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedGroupData?.label || "Grupo"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedGroupData?.description || "Sem descricao"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="p-3 border border-gray-100 rounded-lg">
                    <p className="font-semibold text-gray-900">Catalogados</p>
                    <p className="text-lg">{selectedGroupData?.codes.length ?? 0}</p>
                  </div>
                  <div className="p-3 border border-gray-100 rounded-lg">
                    <p className="font-semibold text-gray-900">Atualizado</p>
                    <p>{formatDate(selectedGroupData?.updatedAt) || "-"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-3">Nenhum grupo selecionado.</p>
            )}
          </div>
        </aside>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-full border border-gray-200 text-gray-600 hover:border-gray-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingCode ? "Editar codigo" : "Novo codigo"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Preencha os campos abaixo para cadastrar o documento normativo.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-1 text-sm">
                  <span className="font-semibold text-gray-700">Nome do codigo</span>
                  <input
                    required
                    value={formData.nomecodigo}
                    onChange={(event) => handleFormChange("nomecodigo", event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-semibold text-gray-700">Normativo</span>
                  <input
                    value={formData.normativo}
                    onChange={(event) => handleFormChange("normativo", event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-semibold text-gray-700">Livro</span>
                  <input
                    value={formData.livro}
                    onChange={(event) => handleFormChange("livro", event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-semibold text-gray-700">Titulo</span>
                  <input
                    value={formData.titulo}
                    onChange={(event) => handleFormChange("titulo", event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </label>
                <label className="space-y-1 text-sm md:col-span-2">
                  <span className="font-semibold text-gray-700">Cabecalho</span>
                  <textarea
                    value={formData.cabecalho}
                    onChange={(event) => handleFormChange("cabecalho", event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 min-h-[80px]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="space-y-1 text-sm">
                  <span className="font-semibold text-gray-700">Numero do artigo</span>
                  <input
                    value={formData.num_artigo}
                    onChange={(event) => handleFormChange("num_artigo", event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-semibold text-gray-700">Ordem</span>
                  <input
                    value={formData.ordem}
                    onChange={(event) => handleFormChange("ordem", event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-semibold text-gray-700">Parte</span>
                  <input
                    value={formData.parte}
                    onChange={(event) => handleFormChange("parte", event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-1 text-sm">
                  <span className="font-semibold text-gray-700">Capitulo</span>
                  <input
                    value={formData.capitulo}
                    onChange={(event) => handleFormChange("capitulo", event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-semibold text-gray-700">Secao</span>
                  <input
                    value={formData.secao}
                    onChange={(event) => handleFormChange("secao", event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-1 text-sm">
                  <span className="font-semibold text-gray-700">Subtitulo</span>
                  <input
                    value={formData.subtitulo}
                    onChange={(event) => handleFormChange("subtitulo", event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="font-semibold text-gray-700">Subsecao</span>
                  <input
                    value={formData.subsecao}
                    onChange={(event) => handleFormChange("subsecao", event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCode(null);
                    setFormData(DEFAULT_FORM);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
                >
                  {editingCode ? "Atualizar" : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
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
      <button type="button" className="px-5 py-2 bg-orange-500 text-white rounded-lg">
        Salvar
      </button>
    </form>
  </section>
);

export default AdminDashboard;

const safeJson = async <T>(response: Response): Promise<T> => {
  try {
    return (await response.json()) as T;
  } catch (error) {
    console.warn("Resposta nao possui JSON valido", error);
    return {} as T;
  }
};

const normalizeCollection = (payload: unknown): VadeMecumCode[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload as VadeMecumCode[];
  }
  if (typeof payload === "object") {
    const objectPayload = payload as Record<string, unknown>;
    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data as VadeMecumCode[];
    }
    if (Array.isArray(objectPayload.content)) {
      return objectPayload.content as VadeMecumCode[];
    }
    if (Array.isArray(objectPayload.items)) {
      return objectPayload.items as VadeMecumCode[];
    }
  }
  return [];
};

const buildPayload = (formData: VadeMecumFormData) => {
  const payload = { ...formData } as Record<string, string>;
  Object.entries(payload).forEach(([key, value]) => {
    if (typeof value === "string") {
      payload[key] = value.trim();
    }
  });
  return payload;
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch (error) {
    console.warn("Nao foi possivel formatar data", error);
    return "-";
  }
};
