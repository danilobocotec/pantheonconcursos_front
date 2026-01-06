import React from "react";
import { Check, X, BookOpen, FileText, Mic, ListChecks } from "lucide-react";

type AprovaOABProps = {
  onNavigate?: (page: string) => void;
};

const AprovaOAB: React.FC<AprovaOABProps> = ({ onNavigate }) => {
  const plans = [
    {
      title: "OAB 1a Fase Anual",
      oldPrice: "De R$ 453,70 por",
      discount: "30% OFF",
      price: "34,90",
      pix: "349,00",
      cta: "COMECE AGORA",
      ctaStyle: "bg-red-600 hover:bg-red-700 text-white",
      features: [
        "Acesso Imediato a TODA 1a Fase da OAB",
        "Sistema de Questoes com + 100 mil questoes on-line",
        "+ 750 Mapas Mentais",
        "Acesso ao Vade Mecum Digital",
        "+ 1.000 Livros digitais (teoria baseada nas questoes)",
      ],
    },
    {
      title: "OAB 1a Fase Vitalicio",
      oldPrice: "De R$ 550,62 por",
      discount: "38% OFF",
      price: "39,90",
      pix: "399,00",
      cta: "COMECE AGORA",
      ctaStyle: "bg-blue-600 hover:bg-blue-700 text-white",
      highlight: true,
      features: [
        "Acesso VITALICIO a TODO conteudo da 1a Fase da OAB",
        "Envio de Simulados Diarios",
        "Sistema de Questoes com + 100 mil questoes on-line",
        "Acesso Imediato a TODA 1a Fase da OAB",
        "+ 750 Mapas Mentais",
        "Acesso ao Vade Mecum Digital",
        "+ 1.000 Livros digitais (teoria baseada nas questoes)",
      ],
    },
    {
      title: "OAB 1a e 2a Fase Anual",
      oldPrice: "De R$ 808,65 por",
      discount: "35% OFF",
      price: "59,90",
      pix: "599,00",
      cta: "COMECE AGORA",
      ctaStyle: "bg-red-600 hover:bg-red-700 text-white",
      features: [
        "Acesso Imediato a TODA 1a Fase da OAB",
        "Acesso Imediato a 2a Fase da OAB (Direito do Trabalho; Direito Penal e Direito Civil)",
        "Sistema de Questoes com + 100 mil questoes on-line",
        "+ 750 Mapas Mentais",
        "Acesso ao Vade Mecum Digital",
        "+ 1.000 Livros digitais (teoria baseada nas questoes)",
      ],
    },
  ];

  const compareRows = [
    {
      label: "Acesso Imediato a TODA 1a Fase da OAB",
      a: true,
      b: true,
      c: true,
    },
    {
      label: "Sistema de Questoes com + 100 mil questoes on-line",
      a: true,
      b: true,
      c: true,
    },
    {
      label: "+ 750 Mapas Mentais",
      a: true,
      b: true,
      c: true,
    },
    {
      label: "Acesso ao Vade Mecum Digital",
      a: true,
      b: true,
      c: true,
    },
    {
      label: "+ 1.000 Livros digitais (teoria baseada nas questoes)",
      a: true,
      b: true,
      c: true,
    },
    {
      label:
        "Acesso Imediato a 2a Fase da OAB (Direito do Trabalho; Direito Penal e Direito Civil)",
      a: false,
      b: false,
      c: true,
    },
    {
      label: "Acesso VITALICIO a TODO conteudo da 1a Fase da OAB.",
      a: false,
      b: true,
      c: false,
    },
    {
      label: "Envio de Simulados Diarios",
      a: false,
      b: true,
      c: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate?.("home")}
            className="flex items-center gap-3"
          >
            <img
              src="/logo-pantheon.png"
              alt="Pantheon Concursos"
              className="h-10 w-auto"
            />
          </button>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-700">
            <button onClick={() => onNavigate?.("home")} className="hover:text-gray-900">
              Home
            </button>
            <button
              onClick={() => onNavigate?.("visao-geral")}
              className="hover:text-gray-900"
            >
              Teste a nossa plataforma
            </button>
            <button className="text-gray-900 font-semibold">Quero ser aprovado</button>
          </nav>
          <button
            onClick={() => onNavigate?.("home:login")}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-6 py-2 rounded-full"
          >
            Entrar
          </button>
        </div>
      </header>

      <section className="pt-14 pb-8 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-semibold text-[#7b1b1b] mb-3">
              Nunca mais compre outro curso para a OAB
            </h1>
            <p className="text-lg text-gray-900 font-semibold">
              Curso OAB 1a Fase com acesso vitalicio.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.title}
                className={`rounded-3xl border border-gray-200 shadow-lg p-8 relative ${
                  plan.highlight
                    ? "bg-[#7b1b1b] text-white lg:scale-105 lg:-mt-4"
                    : "bg-white"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-6 py-1.5 rounded-full text-xs font-semibold shadow">
                      MAIS VENDIDO
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-4">{plan.title}</h3>
                  <div className="text-sm line-through text-gray-400">
                    {plan.oldPrice}
                  </div>
                  <div
                    className={`text-xs font-semibold mt-1 ${
                      plan.highlight ? "text-yellow-300" : "text-red-600"
                    }`}
                  >
                    {plan.discount}
                  </div>
                  <div className="mt-4">
                    <span className="text-sm">12x </span>
                    <span className="text-3xl font-semibold">{plan.price}</span>
                  </div>
                  <div className="text-sm mt-1">
                    ou {plan.pix} a vista no PIX
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (plan.title.includes("Vitalicio")) {
                      onNavigate?.("checkout:oab-1-fase-vitalicio");
                    } else if (plan.title.includes("1a Fase Anual")) {
                      onNavigate?.("checkout:oab-1-fase-anual");
                    } else {
                      onNavigate?.("checkout:oab-1-fase-2-fase-anual");
                    }
                  }}
                  className={`w-full rounded-full py-3 text-sm font-semibold ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </button>
                <ul className="mt-6 space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={`w-4 h-4 mt-0.5 ${
                          plan.highlight ? "text-white" : "text-red-600"
                        }`}
                      />
                      <span
                        className={`${
                          plan.highlight ? "text-white/90" : "text-gray-700"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-sm p-10">
            <h2 className="text-2xl font-semibold text-center mb-8">
              Compare as funcionalidades
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-700">
                    <th className="text-left py-4"> </th>
                    <th className="text-center py-4">OAB 1a Fase Anual</th>
                    <th className="text-center py-4">OAB 1a Fase Vitalicio</th>
                    <th className="text-center py-4">OAB 1a e 2a Fase Anual</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {compareRows.map((row) => (
                    <tr key={row.label} className="border-t">
                      <td className="py-4">{row.label}</td>
                      <td className="text-center">
                        {row.a ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="text-center">
                        {row.b ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="text-center">
                        {row.c ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
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

      <section className="bg-white pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-3xl p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                  O padrao da OAB se repete a cada Exame.
                </h3>
                <p className="text-gray-600 mb-8">
                  Estude no formato da prova: questoes, provas comentadas,
                  simulados e materiais pensados para otimizar cada minuto da
                  preparacao.
                </p>
                <button
                  onClick={() => onNavigate?.("checkout:oab-1-fase-vitalicio")}
                  className="bg-red-600 text-white px-6 py-3 rounded-full text-sm font-semibold"
                >
                  COMECE AGORA MESMO
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6 border-l border-gray-200 pl-8">
                <div className="space-y-2">
                  <div className="text-[#7b1b1b]">
                    <ListChecks className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold">Sistema de questoes</h4>
                  <p className="text-sm text-gray-600">
                    Mais de 100 mil questoes comentadas. Acesse online quando quiser.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-[#7b1b1b]">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold">Livros Digitais</h4>
                  <p className="text-sm text-gray-600">
                    Livros digitais completos com todas as materias da 1a Fase da OAB.
                  </p>
                </div>
                <div className="space-y-2 border-t border-gray-200 pt-6">
                  <div className="text-[#7b1b1b]">
                    <Mic className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold">Audiobooks</h4>
                  <p className="text-sm text-gray-600">
                    Conteudos da 1a Fase em audio para aprender fora dos livros.
                  </p>
                </div>
                <div className="space-y-2 border-t border-gray-200 pt-6">
                  <div className="text-[#7b1b1b]">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold">Simulados Diarios</h4>
                  <p className="text-sm text-gray-600">
                    Todos os dias um novo simulado enviado no seu e-mail.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto mt-8 bg-[#fdf7f4] border border-gray-200 rounded-2xl px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-[#7b1b1b] font-semibold mb-2">
                Dedicar horas de estudo sem evolucao e mais comum do que parece.
              </h4>
              <p className="text-gray-700 text-sm">
                Com o Pantheon, voce nunca mais estuda sozinho. Sao simulados diarios
                entregues no seu e-mail, mais de 100 mil questoes comentadas, provas
                comentadas e um Vade Mecum digital para facilitar sua rotina.
              </p>
            </div>
            <button
              onClick={() => onNavigate?.("checkout:oab-1-fase-vitalicio")}
              className="border border-gray-900 text-gray-900 px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-900 hover:text-white transition-colors"
            >
              Comece hoje mesmo!
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AprovaOAB;
