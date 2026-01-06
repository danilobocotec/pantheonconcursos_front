
import React from "react";
import { buildApiUrl } from "@/lib/api";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  MessageCircle,
  X,
} from "lucide-react";

type PantheonConcursosProps = {
  onNavigate?: (page: string) => void;
  openLoginOnLoad?: boolean;
  onLoginModalShown?: () => void;
};

export const PantheonConcursos = ({
  onNavigate,
  openLoginOnLoad,
  onLoginModalShown,
}: PantheonConcursosProps) => {
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginLoading, setLoginLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState("");

  const persistSession = React.useCallback(
    (data: any, emailValue: string) => {
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
        data?.user?.full_name || data?.full_name || emailValue || "Usuario";

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

      if (isAdmin) {
        onNavigate?.("admin-dashboard");
      } else {
        onNavigate?.("visao-geral");
      }
    },
    [onNavigate, rememberMe]
  );

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoginError("");
    setLoginLoading(true);

    try {
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
          message || "Nao foi possivel autenticar. Verifique suas credenciais."
        );
      }

      const data = await response.json();
      persistSession(data, email);

      setLoginModalOpen(false);
      setEmail("");
      setPassword("");
      setRememberMe(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao autenticar.";
      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  };

  React.useEffect(() => {
    if (openLoginOnLoad) {
      setLoginModalOpen(true);
      onLoginModalShown?.();
    }
  }, [openLoginOnLoad, onLoginModalShown]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate?.("home")}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-md border border-red-700 flex items-center justify-center">
              <svg
                viewBox="0 0 48 48"
                className="w-6 h-6 text-red-800"
                aria-hidden="true"
              >
                <rect x="6" y="22" width="36" height="4" fill="currentColor" />
                <path
                  d="M10 20L24 10L38 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <rect
                  x="14"
                  y="26"
                  width="4"
                  height="12"
                  fill="currentColor"
                />
                <rect
                  x="22"
                  y="26"
                  width="4"
                  height="12"
                  fill="currentColor"
                />
                <rect
                  x="30"
                  y="26"
                  width="4"
                  height="12"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="text-left leading-tight">
              <div className="text-sm font-semibold text-red-800">PANTHEON</div>
              <div className="text-[10px] tracking-[0.3em] text-red-800">
                CONCURSOS
              </div>
            </div>
          </button>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <button
              onClick={() => onNavigate?.("home")}
              className="hover:text-red-700"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate?.("visao-geral")}
              className="hover:text-red-700"
            >
              Teste a nossa plataforma
            </button>
            <button
              onClick={() => onNavigate?.("aprova-oab")}
              className="hover:text-red-700"
            >
              Quero ser aprovado
            </button>
          </nav>
          <button
            onClick={() => setLoginModalOpen(true)}
            className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Entrar
          </button>
        </div>
      </header>
      <section className="bg-[#f7f2ee]">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-red-900 mb-4">
                Nunca mais compre outro curso para a OAB
              </h1>
              <p className="text-sm text-gray-700 mb-2">
                Curso OAB 1a Fase com acesso vitalicio.
              </p>
              <p className="text-sm text-gray-700 mb-6">
                Uma unica compra, conteudo completo e permanente.
              </p>
              <button
                onClick={() => onNavigate?.("checkout:oab-1-fase-vitalicio")}
                className="bg-red-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                QUERO PASSAR NA OAB
              </button>
            </div>
            <div className="relative flex justify-center md:justify-end">
              <div className="w-72 md:w-80">
                <svg viewBox="0 0 240 320" className="w-full h-auto">
                  <defs>
                    <linearGradient
                      id="oabCard"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0" stopColor="#b81f2d" />
                      <stop offset="1" stopColor="#7c0e16" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="30"
                    y="20"
                    width="180"
                    height="280"
                    rx="12"
                    fill="url(#oabCard)"
                  />
                  <rect
                    x="20"
                    y="28"
                    width="180"
                    height="280"
                    rx="12"
                    fill="#e2c9a3"
                    opacity="0.25"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r="38"
                    fill="none"
                    stroke="#e9d7b8"
                    strokeWidth="4"
                  />
                  <path
                    d="M120 95l8 16 18 2-13 12 3 18-16-9-16 9 3-18-13-12 18-2z"
                    fill="#e9d7b8"
                  />
                  <text
                    x="120"
                    y="190"
                    textAnchor="middle"
                    fill="#f6ead1"
                    fontSize="14"
                    fontWeight="700"
                  >
                    CARTEIRA DE IDENTIDADE
                  </text>
                  <text
                    x="120"
                    y="210"
                    textAnchor="middle"
                    fill="#f6ead1"
                    fontSize="14"
                    fontWeight="700"
                  >
                    DE ADVOGADO
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#e6e7f6]">
        <div className="container mx-auto px-6 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-sm font-semibold text-red-700 mb-2">45o Exame</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-red-900 mb-4">
                Todo o conteudo que voce precisa para ser aprovado no Exame da
                OAB
              </h2>
              <p className="text-sm text-red-800">
                Linguagem simples e clara, focada no aprendizado.
              </p>
            </div>
            <div className="space-y-6 text-sm">
              {[
                {
                  title: "Sistema de Questoes",
                  text: "Mais de 100 mil questoes comentadas para voce praticar.",
                },
                {
                  title: "Vade Mecum Digital",
                  text: "As leis mais cobradas na OAB na palma da sua mao.",
                },
                {
                  title: "Simulados Diarios",
                  text: "Todos os dias um novo simulado enviado no seu e-mail.",
                },
                {
                  title: "Livros Digitais (PDFs)",
                  text: "O famoso PDF agora e digital. E o melhor, sempre atualizado.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-9 h-9 rounded-full border-2 border-red-700 flex items-center justify-center text-red-700 font-semibold">
                    <span className="text-xs">v</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {item.title}
                    </div>
                    <div className="text-gray-600">{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center pb-10">
          <button
            onClick={() => onNavigate?.("checkout:oab-1-fase-vitalicio")}
            className="bg-red-600 text-white px-8 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            COMECE AGORA MESMO
          </button>
        </div>
      </section>

      <section className="bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                O padrao da OAB se repete a cada Exame.
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Estude no formato da prova: questoes, provas comentadas,
                simulados e materiais pensados para otimizar cada minuto da
                preparacao.
              </p>
              <button
                onClick={() => onNavigate?.("checkout:oab-1-fase-vitalicio")}
                className="bg-red-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                COMECE AGORA MESMO
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              {[
                {
                  title: "Sistema de questoes",
                  text: "Mais de 100 mil questoes comentadas. Acesse online quando quiser.",
                },
                {
                  title: "Livros Digitais",
                  text: "Livros digitais completos com todas as materias da 1a Fase.",
                },
                {
                  title: "Audiobooks",
                  text: "Conteudos da 1a Fase em audio para aprender fora dos livros.",
                },
                {
                  title: "Simulados Diarios",
                  text: "Simulados com muitas questoes enviados direto no seu e-mail.",
                },
              ].map((item) => (
                <div key={item.title} className="border-t border-gray-200 pt-4">
                  <div className="text-red-800 font-semibold mb-2">
                    {item.title}
                  </div>
                  <p className="text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e6e7f6]">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            Teste agora a nossa Plataforma!
          </h2>
        </div>
      </section>
      <section className="bg-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-2">
            Transforme seu sonho de passar na
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold mb-4">
            OAB em realidade
          </h3>
          <p className="text-sm text-gray-600 mb-10">
            Acesso imediato para voce comecar a estudar agora mesmo.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="border border-gray-200 rounded-2xl p-6 text-left shadow-sm">
              <h4 className="text-lg font-semibold mb-4">OAB 1a Fase Anual</h4>
              <div className="text-xs text-gray-500 line-through">
                De R$ 453,70 por
              </div>
              <div className="text-red-600 text-xs font-semibold mb-3">
                30% OFF
              </div>
              <div className="text-2xl font-semibold">12x 34,90</div>
              <div className="text-xs text-gray-600 mb-4">
                ou 349,00 a vista no PIX
              </div>
              <button
                onClick={() => onNavigate?.("checkout:oab-1-fase-anual")}
                className="w-full bg-red-600 text-white py-2 rounded-full text-sm font-semibold"
              >
                COMECE AGORA
              </button>
              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-red-600" />
                  Acesso imediato a TODA 1a Fase da OAB
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-red-600" />
                  Sistema de questoes com + 100 mil questoes on-line
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-red-600" />
                  + 750 Mapas Mentais
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-red-600" />
                  Acesso ao Vade Mecum Digital
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-red-600" />
                  + 1.000 livros digitais (teoria baseada nas questoes)
                </li>
              </ul>
            </div>

            <div className="bg-red-900 text-white rounded-2xl p-6 text-left shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                MAIS VENDIDO
              </div>
              <h4 className="text-lg font-semibold mb-4">OAB 1a Fase Vitalicio</h4>
              <div className="text-xs text-red-200 line-through">
                De R$ 550,62 por
              </div>
              <div className="text-xs font-semibold mb-3">38% OFF</div>
              <div className="text-2xl font-semibold">12x 39,90</div>
              <div className="text-xs text-red-200 mb-4">
                ou 399,00 a vista no PIX
              </div>
              <button
                onClick={() => onNavigate?.("checkout:oab-1-fase-vitalicio")}
                className="w-full bg-blue-600 text-white py-2 rounded-full text-sm font-semibold"
              >
                COMECE AGORA
              </button>
              <ul className="mt-6 space-y-3 text-sm text-red-100">
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-white" />
                  Acesso vitalicio a TODO conteudo da 1a Fase da OAB
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-white" />
                  Envio de Simulados Diarios
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-white" />
                  Sistema de questoes com + 100 mil questoes on-line
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-white" />
                  + 750 Mapas Mentais
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-white" />
                  + 1.000 livros digitais (teoria baseada nas questoes)
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-2xl p-6 text-left shadow-sm">
              <h4 className="text-lg font-semibold mb-4">
                OAB 1a e 2a Fase Anual
              </h4>
              <div className="text-xs text-gray-500 line-through">
                De R$ 808,65 por
              </div>
              <div className="text-red-600 text-xs font-semibold mb-3">
                35% OFF
              </div>
              <div className="text-2xl font-semibold">12x 59,90</div>
              <div className="text-xs text-gray-600 mb-4">
                ou 599,00 a vista no PIX
              </div>
              <button
                onClick={() =>
                  onNavigate?.("checkout:oab-1-fase-2-fase-anual")
                }
                className="w-full bg-red-600 text-white py-2 rounded-full text-sm font-semibold"
              >
                COMECE AGORA
              </button>
              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-red-600" />
                  Acesso imediato a TODA 1a Fase da OAB
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-red-600" />
                  Acesso imediato a 2a Fase da OAB
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-red-600" />
                  Sistema de questoes com + 100 mil questoes on-line
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-red-600" />
                  + 750 Mapas Mentais
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-red-600" />
                  + 1.000 livros digitais (teoria baseada nas questoes)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-2xl font-semibold text-center mb-8">
              Compare as funcionalidades
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-700">
                    <th className="text-left py-3"> </th>
                    <th className="text-center py-3">OAB 1a Fase Anual</th>
                    <th className="text-center py-3">OAB 1a Fase Vitalicio</th>
                    <th className="text-center py-3">OAB 1a e 2a Fase Anual</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {[
                    "Acesso imediato a TODA 1a Fase da OAB",
                    "Sistema de Questoes com + 100 mil questoes on-line",
                    "+ 750 Mapas Mentais",
                    "Acesso ao Vade Mecum Digital",
                    "+ 1.000 Livros digitais (teoria baseada nas questoes)",
                    "Acesso imediato a 2a Fase da OAB",
                    "Acesso vitalicio a TODO conteudo da 1a Fase da OAB",
                    "Envio de Simulados Diarios",
                  ].map((row, index) => (
                    <tr key={row} className="border-t">
                      <td className="py-4">{row}</td>
                      <td className="text-center">
                        {index <= 4 ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="text-center">
                        {index === 5 ? (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        ) : (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        )}
                      </td>
                      <td className="text-center">
                        {index === 5 ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : index >= 6 ? (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        ) : (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t">
                    <td />
                    <td className="py-6 text-center">
                      <div className="text-xs text-gray-500">12x</div>
                      <div className="text-lg font-semibold">R$ 34,90</div>
                      <button
                        onClick={() => onNavigate?.("checkout:oab-1-fase-anual")}
                        className="mt-3 bg-red-600 text-white px-5 py-2 rounded-full text-xs font-semibold"
                      >
                        Assine agora
                      </button>
                    </td>
                    <td className="py-6 text-center">
                      <div className="text-xs text-gray-500">12x</div>
                      <div className="text-lg font-semibold">R$ 39,90</div>
                      <button
                        onClick={() =>
                          onNavigate?.("checkout:oab-1-fase-vitalicio")
                        }
                        className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-semibold"
                      >
                        Assine agora
                      </button>
                    </td>
                    <td className="py-6 text-center">
                      <div className="text-xs text-gray-500">12x</div>
                      <div className="text-lg font-semibold">R$ 59,90</div>
                      <button
                        onClick={() =>
                          onNavigate?.("checkout:oab-1-fase-2-fase-anual")
                        }
                        className="mt-3 bg-red-600 text-white px-5 py-2 rounded-full text-xs font-semibold"
                      >
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
      <section className="bg-[#e6e7f6]">
        <div className="container mx-auto px-6 py-16">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Aqui voce passa na OAB
          </p>
          <h3 className="text-2xl font-semibold text-gray-900 mb-8">
            Confira os depoimentos de quem ja estudou para a OAB com o Pantheon
          </h3>
          <div className="bg-white rounded-2xl shadow-sm p-8 flex items-center justify-between">
            <button className="text-gray-400 hover:text-gray-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center max-w-xl">
              <p className="text-sm text-gray-500 italic mb-4">
                "Em cada disciplina tenho as videoaulas, e-books, questoes para
                verificar meu desempenho, sendo que o gabarito e comentado"
              </p>
              <div className="text-sm font-semibold text-gray-700">
                Ana Veronica A. Vieira Belo
              </div>
              <div className="text-xs text-gray-500">Rio de Janeiro - RJ</div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#e6e7f6]">
        <div className="container mx-auto px-6 py-16">
          <h3 className="text-3xl font-semibold text-gray-900 mb-4">
            Ainda com duvidas?
          </h3>
          <p className="text-sm text-gray-700 mb-6">
            Abaixo voce encontra as perguntas mais comuns sobre o nosso curso
          </p>
          <div className="space-y-4 max-w-4xl mx-auto">
            {[
              "Quais as vantagens dos planos ofertados?",
              "O curso e totalmente online?",
              "Ate quando eu vou ter acesso ao meu curso?",
              "Como faco para ter acesso aos Simulados Diarios OAB?",
              "Quais sao as formas de pagamento?",
              "Apos pagamento, qual prazo para liberacao do meu curso?",
              "Nao gostei, posso cancelar?",
              "Como sao atualizados os cursos do Pantheon?",
              "Posso compartilhar meu acesso com algum amigo?",
            ].map((question) => (
              <button
                key={question}
                className="w-full text-left bg-[#e0e3f4] px-5 py-4 rounded-lg flex items-center justify-between text-sm font-semibold text-gray-800"
              >
                {question}
                <span className="text-gray-500">&gt;</span>
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <button
              onClick={() => onNavigate?.("checkout:oab-1-fase-vitalicio")}
              className="bg-red-600 text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              QUERO COMECAR AGORA MESMO!
            </button>
          </div>
        </div>
      </section>

      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:bg-green-600"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {loginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setLoginModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 leading-tight">
                  Faca login com sua conta
                </h2>
                <p className="text-2xl font-semibold text-red-700">Pantheon</p>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-gray-200">
                    <svg
                      viewBox="0 0 48 48"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611 20.083H42V20H24v8h11.303C33.749 32.657 29.23 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.955 3.045l5.657-5.657C34.047 6.053 29.268 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.651-.389-3.917z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.306 14.691l6.571 4.819C14.655 16.137 19.007 13 24 13c3.059 0 5.842 1.154 7.955 3.045l5.657-5.657C34.047 6.053 29.268 4 24 4 16.318 4 9.656 8.293 6.306 14.691z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24 44c5.127 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.142 35.091 26.715 36 24 36c-5.206 0-9.712-3.318-11.275-7.946l-6.523 5.025C9.505 39.556 16.227 44 24 44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611 20.083H42V20H24v8h11.303c-.749 2.12-2.194 3.929-4.084 5.565l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.651-.389-3.917z"
                      />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-700">
                    Entrar com Google
                  </span>
                </button>
                <button
                  type="button"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M13.5 8.5V7.1c0-.7.5-1.1 1.2-1.1H16V3.2c-.2 0-.9-.1-1.7-.1-1.7 0-2.9 1-2.9 3v2.4H9.5v2.7h2.2V21h2.8v-9.8h2.3l.4-2.7h-2.7z"
                      />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-700">
                    Entrar com Facebook
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                <span className="h-px bg-gray-200 flex-1" />
                Ou entre com e-mail
                <span className="h-px bg-gray-200 flex-1" />
              </div>

              <form className="space-y-4" onSubmit={handleAuth}>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent pr-12"
                      disabled={loginLoading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-70"
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

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-700">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                      disabled={loginLoading}
                    />
                    Lembrar senha
                  </label>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 underline underline-offset-2"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                {loginError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {loginError}
                  </div>
                )}

                <div className="text-sm text-gray-700">
                  Nao tem conta?{" "}
                  <button
                    type="button"
                    className="text-blue-600 font-semibold hover:text-blue-700"
                  >
                    Criar uma Conta
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={loginLoading}
                >
                  {loginLoading ? "Enviando..." : "Entrar"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PantheonConcursos;
