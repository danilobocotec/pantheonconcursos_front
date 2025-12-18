import React from "react";
import { buildApiUrl } from "@/lib/api";
import type { LucideIcon } from "lucide-react";
import {
  Menu,
  X,
  ChevronRight,
  CheckCircle,
  Star,
  BookOpen,
  Users,
  Trophy,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";

type PantheonConcursosProps = {
  onNavigate?: (page: string) => void;
};

type Stat = {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
};

const stats: Stat[] = [
  {
    icon: Users,
    value: "10.000+",
    label: "Alunos Ativos",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Trophy,
    value: "5.000+",
    label: "Aprovados",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: BookOpen,
    value: "50+",
    label: "Cursos Disponíveis",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Avaliação",
    color: "from-blue-500 to-cyan-500",
  },
];

export const PantheonConcursos = ({ onNavigate }: PantheonConcursosProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isRegisterMode, setIsRegisterMode] = React.useState(false);
  const [authSuccess, setAuthSuccess] = React.useState("");
  const [loginLoading, setLoginLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState("");

  const persistSession = React.useCallback(
    (data: any, emailValue: string, nameValue?: string) => {
      const role = (
        data?.user?.role ||
        data?.role ||
        data?.user?.profile ||
        ""
      )
        .toString()
        .toLowerCase();
      const isAdmin = role.includes("admin");
      const resolvedName =
        data?.user?.full_name ||
        data?.full_name ||
        nameValue ||
        emailValue ||
        "Usuário";

      if (typeof window !== "undefined") {
        if (data?.token || data?.accessToken) {
          window.localStorage.setItem(
            "pantheon:token",
            data?.token || data?.accessToken
          );
        }
        window.localStorage.setItem("pantheon:isAdmin", String(isAdmin));
        if (role) {
          window.localStorage.setItem("pantheon:role", role);
        }
        if (resolvedName) {
          window.localStorage.setItem("pantheon:fullName", resolvedName);
        }
        if (rememberMe) {
          window.localStorage.setItem("pantheon:lastEmail", emailValue);
        } else {
          window.localStorage.removeItem("pantheon:lastEmail");
        }
      }

      onNavigate?.("visao-geral");
    },
    [onNavigate, rememberMe]
  );

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoginError("");
    setAuthSuccess("");
    setLoginLoading(true);

    try {
      if (isRegisterMode) {
        if (!fullName || !email || !password || !confirmPassword) {
          throw new Error("Preencha nome, e-mail e senha.");
        }
        if (password !== confirmPassword) {
          throw new Error("As senhas não conferem.");
        }

        const registerResponse = await fetch(buildApiUrl("/auth/register"), {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: fullName,
            email,
            password,
            confirm: confirmPassword,
          }),
        });

        if (!registerResponse.ok) {
          const message = await registerResponse.text();
          throw new Error(message || "Não foi possível registrar.");
        }

        setAuthSuccess("Cadastro realizado! Entrando...");
      }

      if (!email || !password) {
        throw new Error("Informe e-mail e senha.");
      }

      const response = await fetch(buildApiUrl("/auth/login"), {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || "Não foi possível autenticar. Verifique suas credenciais."
        );
      }

      const data = await response.json();
      persistSession(data, email, fullName);

      setLoginModalOpen(false);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFullName("");
      setRememberMe(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao autenticar/registrar.";
      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Pantheon Concursos
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="#home"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Início
              </a>
              <button
                onClick={() => onNavigate?.("visao-geral")}
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Teste a nossa plataforma
              </button>
              <button
                onClick={() => onNavigate?.("aprova-oab")}
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Quero ser aprovado
              </button>
              <button
                onClick={() => onNavigate?.("admin-dashboard")}
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Área Admin
              </button>
            </nav>

            <button
              className="hidden md:block bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
              onClick={() => setLoginModalOpen(true)}
            >
              Entrar
            </button>

            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 space-y-4">
              <a
                href="#home"
                className="block text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Início
              </a>
              <button
                onClick={() => onNavigate?.("visao-geral")}
                className="block text-left w-full text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Teste a nossa plataforma
              </button>
              <button
                onClick={() => onNavigate?.("aprova-oab")}
                className="block text-left w-full text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Quero ser aprovado
              </button>
              <button
                onClick={() => onNavigate?.("admin-dashboard")}
                className="block text-left w-full text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Área Admin
              </button>
              <button
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold"
                onClick={() => setLoginModalOpen(true)}
              >
                Entrar
              </button>
            </nav>
          )}
        </div>
      </header>
      {loginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setLoginModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
                            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {isRegisterMode ? "Crie sua conta" : "Faça login com sua conta"}
                </h2>
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Pantheon
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <button className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <img
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIyLjU2IDEyLjI1YzAtLjc4LS4wNy0xLjUzLS4yLTIuMjVIMTJ2NC4yNmg1LjkyYy0uMjYgMS4zNy0xLjA0IDIuNTMtMi4yMSAzLjMxdjIuNzdoMy41N2MyLjA4LTEuOTIgMy4yOC00Ljc0IDMuMjgtOC4wOXoiIGZpbGw9IiM0Mjg1RjQiLz48cGF0aCBkPSJNMTIgMjNjMi45NyAwIDUuNDYtLjk4IDcuMjgtMi42NmwtMy41Ny0yLjc3Yy0uOTguNjYtMi4yMyAxLjA2LTMuNzEgMS4wNi0yLjg2IDAtNS4yOS0xLjkzLTYuMTYtNC41M0gyLjE4djIuODRDMy45OSAyMC41MyA3LjcgMjMgMTIgMjN6IiBmaWxsPSIjMzRBODUzIi8+PHBhdGggZD0iTTUuODQgMTQuMDljLS4yMi0uNjYtLjM1LTEuMzYtLjM1LTIuMDlzLjEzLTEuNDMuMzUtMi4wOVY3LjA3SDIuMThDMS40MyA4LjU1IDEgMTAuMjIgMSAxMnMuNDMgMy40NSAxLjE4IDQuOTNsMi44NS0yLjIyLjgxLS42MnoiIGZpbGw9IiNGQkJDMDUiLz48cGF0aCBkPSJNMTIgNS4zOGMyLjYyIDAgNC44OC45IDYuNyAyLjY2bDUuMDMtNS4wM0MxOS43MSAxLjc5IDE2LjEyIDAgMTIgMCA3LjcgMCAzLjk5IDIuNDcgMi4xOCA2LjEybDMuNjYgMi44NC44Ny0yLjYgMy4zLTQuNTggNi4xNi00LjU4eiIgZmlsbD0iI0VBNDMzNSIvPjwvc3ZnPg=="
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span className="text-gray-700 font-medium">
                    Entrar com Google
                  </span>
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-gray-700 font-medium">
                    Entrar com Facebook
                  </span>
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {isRegisterMode ? "Cadastre-se com e-mail" : "Ou entre com e-mail"}
                  </span>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleAuth}>
                {isRegisterMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Nome completo:
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      disabled={loginLoading}
                      autoComplete="name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={loginLoading}
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Senha:
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                      disabled={loginLoading}
                      autoComplete={isRegisterMode ? "new-password" : "current-password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-70"
                      disabled={loginLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {isRegisterMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Confirmar senha:
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      disabled={loginLoading}
                      autoComplete="new-password"
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    disabled={loginLoading}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Lembrar senha
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Esqueci minha senha
                  </a>
                </div>

                <div className="text-sm text-gray-700">
                  {isRegisterMode ? "Já tem conta?" : "Não tem conta?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode((previous) => !previous);
                      setLoginError("");
                      setAuthSuccess("");
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {isRegisterMode ? "Fazer login" : "Criar uma Conta"}
                  </button>
                </div>

                {loginError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {loginError}
                  </div>
                )}

                {authSuccess && (
                  <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    {authSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={loginLoading}
                >
                  {loginLoading
                    ? "Enviando..."
                    : isRegisterMode
                    ? "Cadastrar e entrar"
                    : "Entrar"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <section
        id="home"
        className="pt-28 pb-20 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-block">
                <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  A Melhor Plataforma de Concursos do Brasil
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Sua Aprovação em{" "}
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Concursos Públicos
                </span>{" "}
                Começa Aqui
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Prepare-se com os melhores professores, material completo e
                metodologia comprovada. Milhares de aprovados em todo o Brasil
                confiam no Pantheon Concursos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                  onClick={() => onNavigate?.("aprova-oab")}
                >
                  Quero ser aprovado
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-all">
                  Conhecer Cursos
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex-1">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=800&fit=crop"
                alt="Estudantes preparando-se para concursos"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>
      <section id="quero-ser-aprovada" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Quero ser{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                aprovada
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transforme seu sonho em realidade com nossa metodologia exclusiva
              de aprovação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl hover:shadow-xl transition-all border border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Método Eficaz
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nossa metodologia é baseada em técnicas comprovadas que já
                aprovaram milhares de alunas.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Cronograma personalizado
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Técnicas de memorização</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Resolução estratégica</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl hover:shadow-xl transition-all border border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Mentoria Exclusiva
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Acompanhamento individual com professores experientes e
                aprovados.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Suporte direto com professores
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Correção de simulados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Orientação estratégica</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl hover:shadow-xl transition-all border border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Garantia de Resultado
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Comprometimento total com sua aprovação. Se não passar, continue
                estudando gratuitamente.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Garantia de aprovação</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Acesso estendido</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Suporte contínuo</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 rounded-3xl p-8 md:p-12 mb-20">
            <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Histórias de{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Sucesso
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
                    alt="Juliana Silva"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-orange-200"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">Juliana Silva</h4>
                    <p className="text-sm text-orange-600">
                      Aprovada OAB XXXVII
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "Depois de 3 tentativas frustradas, encontrei o Pantheon. A
                  metodologia e o suporte mudaram completamente minha forma de
                  estudar. Finalmente sou advogada!"
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-orange-500 text-orange-500"
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
                    alt="Carla Mendes"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-orange-200"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">Carla Mendes</h4>
                    <p className="text-sm text-orange-600">
                      Aprovada OAB XXXVIII
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "O diferencial está no acompanhamento individualizado. Cada
                  dúvida era respondida, cada dificuldade trabalhada. Hoje sou
                  advogada realizada!"
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-orange-500 text-orange-500"
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop"
                    alt="Fernanda Costa"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-orange-200"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">Fernanda Costa</h4>
                    <p className="text-sm text-orange-600">
                      Aprovada OAB XXXIX
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "Conciliar trabalho e estudo era meu maior desafio. Com o
                  método do Pantheon consegui otimizar meu tempo e alcançar
                  minha aprovação!"
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-orange-500 text-orange-500"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Está pronta para ser a próxima aprovada?
            </h3>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Junte-se a milhares de mulheres que já realizaram o sonho de se
              tornar advogadas
            </p>
            <button
              onClick={() => onNavigate?.("aprova-oab")}
              className="bg-white text-orange-600 px-10 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              Quero Garantir Minha Aprovação
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Transforme seu sonho de passar na{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                OAB em realidade
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Acesso imediato para você começar a estudar agora mesmo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                OAB 1ª Fase Anual
              </h3>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500 line-through text-sm">
                    De R$ 453,70 por
                  </span>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    30% OFF
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-700">12x</span>
                  <span className="text-4xl font-bold text-gray-900">
                    34,90
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  ou 349,00 à vista no PIX
                </p>
              </div>

              <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 rounded-full mb-6 hover:shadow-lg transition-all hover:scale-105">
                COMECE AGORA
              </button>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Acesso Imediato à TODA 1ª Fase da OAB
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Sistema de Questões com + 100 mil questões on-line
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">+ 750 Mapas Mentais</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Acesso ao Vade Mecum Digital
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    + 1.000 Livros digitais (teoria baseada nas questões)
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-800 to-red-900 rounded-3xl p-8 hover:shadow-2xl transition-all relative transform md:scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  MAIS VENDIDO
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-6">
                OAB 1Â¬ Fase VitalÃcio
              </h3>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-200 line-through text-sm">
                    De R$ 550,62 por
                  </span>
                  <span className="bg-white text-red-800 text-xs font-bold px-2 py-1 rounded">
                    38% OFF
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-white">12x</span>
                  <span className="text-4xl font-bold text-white">39,90</span>
                </div>
                <p className="text-sm text-red-200 mt-1">
                  ou 399,00 Ã“ vista no PIX
                </p>
              </div>

              <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-full mb-6 hover:bg-blue-700 transition-all hover:scale-105 shadow-lg">
                COMECE AGORA
              </button>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">
                    Acesso VITALâ•CIO Ã“ TODO conteÂ·do da 1Â¬ Fase da OAB
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Envio de Simulados DiÃŸrios</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">
                    Sistema de QuestÂ§es com + 100 mil questÂ§es on-line
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">
                    Acesso Imediato Ã“ TODA 1Â¬ Fase da OAB
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">+ 750 Mapas Mentais</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">
                    Acesso ao Vade Mecum Digital
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">
                    + 1.000 Livros digitais (teoria baseada nas questÂ§es)
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                OAB 1Â¬ e 2Â¬ Fase Anual
              </h3>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500 line-through text-sm">
                    De R$ 000,65 por
                  </span>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    35% OFF
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-700">12x</span>
                  <span className="text-4xl font-bold text-gray-900">
                    59,90
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  ou 599,00 Ã“ vista no PIX
                </p>
              </div>

              <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 rounded-full mb-6 hover:shadow-lg transition-all hover:scale-105">
                COMECE AGORA
              </button>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Acesso Imediato Ã“ TODA 1Â¬ Fase da OAB
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Acesso Imediato Ã“ 2Â¬ Fase da OAB (Direito do Trabalho;
                    Direito Penal e Direito Civil)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Sistema de QuestÂ§es com + 100 mil questÂ§es on-line
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">+ 750 Mapas Mentais</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Acesso ao Vade Mecum Digital
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    + 1.000 Livros digitais (teoria baseada nas questÂ§es)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Compare as funcionalidades
            </h2>
          </div>

          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-6 font-bold text-gray-900 w-1/2"></th>
                    <th className="text-center p-6 font-bold text-gray-900">
                      OAB 1Â¬ Fase Anual
                    </th>
                    <th className="text-center p-6 font-bold text-gray-900 bg-red-50">
                      OAB 1Â¬ Fase VitalÃcio
                    </th>
                    <th className="text-center p-6 font-bold text-gray-900">
                      OAB 1Â¬ e 2Â¬ Fase Anual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-6 text-gray-700">
                      Acesso Imediato Ã“ TODA 1Â¬ Fase da OAB
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center bg-red-50">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="p-6 text-gray-700">
                      Sistema de QuestÂ§es com + 100 mil questÂ§es on-line
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center bg-red-50">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="p-6 text-gray-700">+ 750 Mapas Mentais</td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center bg-red-50">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="p-6 text-gray-700">
                      Acesso ao Vade Mecum Digital
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center bg-red-50">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="p-6 text-gray-700">
                      + 1.000 Livros digitais (teoria baseada nas questÂ§es)
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center bg-red-50">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="p-6 text-gray-700">
                      Acesso Imediato Ã“ 2Â¬ Fase da OAB (Direito do Trabalho;
                      Direito Penal e Direito Civil)
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <X className="w-5 h-5 text-red-600" />
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center bg-red-50">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <X className="w-5 h-5 text-red-600" />
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="p-6 text-gray-700">
                      Acesso VITALâ•CIO Ã“ TODO conteÂ·do da 1Â¬ Fase da OAB.
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <X className="w-5 h-5 text-red-600" />
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center bg-red-50">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <X className="w-5 h-5 text-red-600" />
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-6"></td>
                    <td className="p-6 text-center">
                      <div className="mb-3">
                        <div className="text-sm text-gray-600">12x</div>
                        <div className="text-2xl font-bold text-gray-900">
                          R$ 34,90
                        </div>
                      </div>
                      <button className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-6 rounded-full hover:shadow-lg transition-all">
                        Assine agora
                      </button>
                    </td>
                    <td className="p-6 text-center bg-red-50">
                      <div className="mb-3">
                        <div className="text-sm text-gray-600">12x</div>
                        <div className="text-2xl font-bold text-gray-900">
                          R$ 39,90
                        </div>
                      </div>
                      <button className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-all">
                        Assine agora
                      </button>
                    </td>
                    <td className="p-6 text-center">
                      <div className="mb-3">
                        <div className="text-sm text-gray-600">12x</div>
                        <div className="text-2xl font-bold text-gray-900">
                          R$ 59,90
                        </div>
                      </div>
                      <button className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-6 rounded-full hover:shadow-lg transition-all">
                        Assine agora
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Ainda com{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                dÂ·vidas?
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Abaixo vocÃ› encontra as perguntas mais comuns sobre o nosso curso
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-lg text-gray-900">
                  Quais as vantagens dos planos ofertados?
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-orange-600 transition-transform ${
                    openFaq === 0 ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === 0 && (
                <div className="px-8 pb-6 text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Com o curso{" "}
                    <strong className="text-orange-600">
                      OAB 1Â¬ Fase Anual
                    </strong>{" "}
                    vocÃ› terÃŸ acesso durante 01 ano (contados apÂ¾s a compra) ao
                    conteÂ·do completo para estudar para a 1Â¬ Fase do Exame da
                    OAB. AlÃšm disso vocÃ› receberÃŸ acesso Ã“s Provas Anteriores da
                    OAB para resolver on line. Todas as questÂ§es comentadas
                    pelos nossos professores.
                  </p>
                  <p>
                    Com o curso{" "}
                    <strong className="text-orange-600">
                      OAB 1Â¬ Fase Acesso VitalÃcio
                    </strong>{" "}
                    vocÃ› terÃŸ acesso vitalÃcio ao conteÂ·do completo para estudar
                    para a 1Â¬ Fase do Exame da OAB. AlÃšm disso vocÃ› receberÃŸ
                    acesso Ã“s Provas Anteriores da OAB para resolver on line.
                    Todas as questÂ§es comentadas pelos nossos professores. VocÃ›
                    receberÃŸ tambÃšm todos os dias no seu e-mail 01 Simulado
                    Exclusivo para treinar para a prova. Todos os dias um
                    simulado diferente.
                  </p>
                  <p>
                    Com o curso{" "}
                    <strong className="text-orange-600">
                      OAB 1Â¬ e 2Â¬ Fase Anual
                    </strong>{" "}
                    vocÃ› terÃŸ acesso durante 01 ano (contados apÂ¾s a compra) a
                    todo o conteÂ·do disponÃvel em nossa Plataforma. Tudo para
                    vocÃ› se preparar para as provas da 1Â¬ e 2Â¬ Fase do Exame de
                    Ordem! Lembrando que na 2Â¬ Fase disponibilizamos os cursos
                    para as seguintes disciplinas: Direito Civil, Direito Penal
                    e Direito do Trabalho. AlÃšm disso vocÃ› receberÃŸ acesso Ã“s
                    Provas Anteriores da OAB para resolver on line. Todas as
                    questÂ§es comentadas pelos nossos professores.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-lg text-gray-900">
                  O curso Ãš totalmente online?
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-orange-600 transition-transform ${
                    openFaq === 1 ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === 1 && (
                <div className="px-8 pb-6 text-gray-700 leading-relaxed">
                  <p>
                    Sim. Todo nosso curso serÃŸ acessado de forma online, no seu
                    computador, celular ou tablet.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-lg text-gray-900">
                  AtÃš quando eu vou ter acesso ao meu curso?
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-orange-600 transition-transform ${
                    openFaq === 2 ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === 2 && (
                <div className="px-8 pb-6 text-gray-700 leading-relaxed">
                  <p>
                    Nossos cursos para OAB 1Â¬ Fase possuem a opÃ¾Ã’o de acesso por
                    1 ano contados apÂ¾s a compra ou o acesso vitalÃcio. VocÃ›
                    escolhe. Em relaÃ¾Ã’o ao nosso curso para a 2Â¬ fase, seu
                    acesso serÃŸ por 1 ano contados apÂ¾s a compra.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Pronto Para Conquistar Sua Aprovação?
          </h2>
          <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Junte-se a milhares de alunos que jÃŸ conquistaram seus sonhos com o
            Pantheon Concursos
          </p>
          <button
            className="bg-white text-orange-600 px-10 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2"
            onClick={() => onNavigate?.("aprova-oab")}
          >
            Quero ser aprovado
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default PantheonConcursos;



























