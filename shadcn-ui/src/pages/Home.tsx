import React, { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Crosshair,
  Facebook,
  FileCheck,
  FileText,
  Instagram,
  LibraryBig,
  Mail,
  Map,
  Scale,
  Star,
  Timer,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// --- Types & Constants ---

type PlanProps = {
  title: string;
  price: string;
  period: string;
  pixPrice: string;
  link: string;
  features: string[];
  isHighlighted?: boolean;
};

type PantheonConcursosProps = {
  onNavigate?: (page: string) => void;
  openLoginOnLoad?: boolean;
  onLoginModalShown?: () => void;
};

const PLANS: PlanProps[] = [
  {
    title: "CURSO OAB 1ª FASE ANUAL",
    price: "34,90",
    period: "12x",
    pixPrice: "349,00",
    link: "https://pantheonconcursos.com.br/checkout/oab-primeira-fase",
    features: [
      "Acesso Imediato à TODA 1ª Fase da OAB",
      "Sistema de Questões com + 100 mil questões on-line",
      "+ 750 Mapas Mentais",
      "Aulas em áudio (audiobooks)",
      "Acesso ao Vade Mecum Digital",
      "+ 1.000 Livros digitais (teoria baseada nas questões)",
    ],
  },
  {
    title: "CURSO OAB 1ª FASE ACESSO VITALÍCIO",
    price: "39,90",
    period: "12x",
    pixPrice: "399,00",
    link: "https://pantheonconcursos.com.br/checkout/oab-primeira-fase-vitalicio",
    isHighlighted: true,
    features: [
      "Acesso VITÁLICIO à TODO conteúdo da 1ª Fase da OAB",
      "Envio de Simulados Diários",
      "Sistema de Questões com + 100 mil questões on-line",
      "Acesso Imediato à TODA 1ª Fase da OAB",
      "+ 750 Mapas Mentais",
      "Aulas em áudio (audiobooks)",
      "Acesso ao Vade Mecum Digital",
      "+ 1.000 Livros digitais (teoria baseada nas questões)",
    ],
  },
  {
    title: "CURSO OAB 1ª e 2ª FASE ANUAL",
    price: "59,90",
    period: "12x",
    pixPrice: "599,00",
    link: "https://pantheonconcursos.com.br/checkout/oab-segunda-fase",
    features: [
      "Acesso Imediato à TODA 1ª Fase da OAB",
      "Acesso Imediato à 2ª Fase da OAB (Direito do Trabalho, Penal e Civil)",
      "Sistema de Questões com + 100 mil questões on-line",
      "+ 750 Mapas Mentais",
      "Aulas em áudio (audiobooks)",
      "Acesso ao Vade Mecum Digital",
      "+ 1.000 Livros digitais (teoria baseada nas questões)",
    ],
  },
];

const FAQS = [
  {
    question: "Quais as vantagens dos planos ofertados?",
    answer:
      "Com o curso OAB 1ª Fase Anual você terá acesso durante 01 ano (contados após a compra) ao conteúdo completo para estudar para a 1ª Fase do Exame da OAB. Além disso você receberá acesso às Provas Anteriores da OAB para resolver on line. Todas as questões comentadas pelos nossos professores.\n\nCom o curso OAB 1ª Fase Acesso Vitalício você terá acesso vitalício ao conteúdo completo para estudar para a 1ª Fase do Exame da OAB. Além disso você receberá acesso às Provas Anteriores da OAB para resolver on line. Todas as questões comentadas pelos nossos professores. Você receberá também todos os dias no seu e-mail 01 Simulado Exclusivo para treinar para a prova. Todos os dias um simulado diferente.\n\nCom o curso OAB 1ª e 2ª Fase Anual você terá acesso durante 01 ano (contados após a compra) a todo o conteúdo disponível em nossa Plataforma. Tudo para você se preparar para as provas da 1ª e 2ª Fase do Exame de Ordem! Lembrando que na 2ª Fase disponibilizamos os cursos para as seguintes disciplinas: Direito Civil, Direito Penal e Direito do Trabalho. Além disso você receberá acesso às Provas Anteriores da OAB para resolver on line. Todas as questões comentadas pelos nossos professores.",
  },
  {
    question: "O curso é totalmente online?",
    answer:
      "Sim. Todo o curso é acessado 100% online no computador, celular ou tablet.",
  },
  {
    question: "Até quando eu vou ter acesso ao meu curso?",
    answer:
      "Para a 1ª Fase, você escolhe: 1 ano (contado após a compra) ou acesso vitalício. Para a 2ª Fase, o acesso é de 1 ano a contar da compra.",
  },
  {
    question: "Como faço para ter acesso aos Simulados Diários OAB?",
    answer:
      "Adquirindo o OAB 1ª Fase Acesso Vitalício, você passa a receber diariamente no seu e-mail nossos simulados exclusivos. Todo dia um novo simulado para baixar e estudar quando e onde quiser.",
  },
  {
    question: "Quais são as formas de pagamento?",
    answer:
      "Aqui no Pantheon OAB você pode comprar os cursos de 02 formas:\n\nCartão de crédito à vista ou parcelado em até 12x sem juros\nPIX à vista",
  },
  {
    question: "Após pagamento, qual prazo para liberação de meu curso?",
    answer:
      "Pagando por cartão de crédito ou PIX, a liberação é imediata após a confirmação do pagamento.",
  },
  {
    question: "Não gostei, posso cancelar?",
    answer:
      "Claro! Dentro de 07 dias a contar do pedido, envie um e-mail para contato@pantheonconcursos.com.br que realizamos o cancelamento.",
  },
  {
    question: "Como são atualizados os cursos do Pantheon?",
    answer:
      "Os cursos são continuamente atualizados: incorporamos mudanças de novos editais e mantemos o conteúdo alinhado às provas.\n\nMudanças Legislativas e Jurisprudência Atual: acompanhamento rigoroso das alterações relevantes.\nRevisão Periódica: correções e aprimoramentos para garantir qualidade.\nNovos Formatos de Prova: adaptação a tipos de questões e métodos avaliativos.\nEvolução das Disciplinas: inclusão de novos tópicos e revisão dos menos relevantes.",
  },
  {
    question: "Posso compartilhar meu acesso com algum amigo?",
    answer:
      "Não. O acesso é pessoal e intransferível. Nosso sistema detecta acesso simultâneo e bloqueia a conta em caso de compartilhamento, conforme nossos Termos de Uso.",
  },
];

const TESTIMONIALS = [
  {
    name: "Ana Verônica A. Vieira",
    text: "Em cada disciplina tenho e-books e questões para verificar meu desempenho, sendo que o gabarito é comentado",
    rating: 5,
  },
  {
    name: "Renata Maria da Silva",
    text: "O curso do Pantheon me auxiliou muito nos estudos e preparação para o Exame da OAB. Sem contar do excelente atendimento da plataforma quando surgiam dúvidas",
    rating: 5,
  },
  {
    name: "Sandro Vinicius",
    text: "Eu não conhecia a Pantheon até começar esse ano a estudar com eles, foi uma ótima experiência, além do excelente atendimento, preço justo e também um material e método para OAB excelentes. Indico para todos que buscam um ensino de qualidade e ainda atenção e carinho.",
    rating: 5,
  },
  {
    name: "Sulieni Aparecida Felix",
    text: "Tem sido incrível estudar com a Pantheon, o material possui conteúdo prático e eficaz, de fácil entendimento. Além disso, a equipe de atendimento é excelente, respondendo minhas dúvidas com rapidez e eficiência.",
    rating: 5,
  },
  {
    name: "Michelle Prata",
    text: "Estou com 40 pontos graças a Deus. Só estudei pelos simulados de vcs. Mto obrigada",
    rating: 5,
  },
  {
    name: "Celio Godoy",
    text: "Usei somente o recurso de questões e as aulas os mapas mentais acabei não utilizando. As aulas são bem interativas, as questões dentro da atualidade.",
    rating: 5,
  },
];

// --- Sub-components ---

const CTAButton = ({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`bg-[#0BA106] hover:bg-[#098905] text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full shadow-lg transition-colors text-base sm:text-lg uppercase tracking-wider ${className}`}
  >
    {children}
  </motion.button>
);

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
  >
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#771819]/10 text-[#771819] rounded-xl flex items-center justify-center mb-3 sm:mb-4">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
      {title}
    </h3>
    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
      {description}
    </p>
  </motion.div>
);

const PricingCard = ({
  title,
  price,
  period,
  pixPrice,
  features,
  isHighlighted,
  link,
}: PlanProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className={`relative flex flex-col p-6 sm:p-8 rounded-3xl ${
      isHighlighted
        ? "bg-[#771819] text-white shadow-2xl sm:scale-105 z-10"
        : "bg-white text-slate-900 border border-slate-200"
    }`}
  >
    {isHighlighted && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0BA106] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
        Mais Escolhido
      </div>
    )}
    <h3 className="text-base sm:text-lg font-bold mb-4 min-h-[3rem] sm:h-12 flex items-center">
      {title}
    </h3>
    <div className="mb-6">
      <span className="text-xs sm:text-sm font-medium opacity-70">
        Até 12x sem juros de
      </span>
      <div className="flex items-baseline gap-1">
        <span
          className="text-3xl sm:text-4xl font-extrabold italic"
          style={{ fontStyle: "normal" }}
        >
          R$ {price}
        </span>
      </div>
      <p className="mt-2 text-xs sm:text-sm opacity-80">
        ou R$ {pixPrice} à vista no PIX
      </p>
    </div>
    <div className="flex-grow space-y-3 sm:space-y-4 mb-6 sm:mb-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex gap-2 sm:gap-3 text-xs sm:text-sm items-start"
        >
          <CheckCircle2
            size={16}
            className={`flex-shrink-0 mt-0.5 ${
              isHighlighted ? "text-[#0BA106]" : "text-[#771819]"
            }`}
          />
          <span>{feature}</span>
        </div>
      ))}
    </div>
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`block text-center py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold uppercase transition-transform active:scale-95 ${
        isHighlighted
          ? "bg-[#0BA106] hover:bg-[#098905] text-white"
          : "bg-[#771819] hover:bg-[#5f1314] text-white"
      }`}
      style={{ background: "#098905" }}
    >
      Quero este plano
    </a>
  </motion.div>
);

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-3 sm:py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-2 group gap-4"
      >
        <span className="text-base sm:text-lg font-semibold text-slate-800 group-hover:text-[#771819] transition-colors pr-2">
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="text-[#771819] flex-shrink-0 w-5 h-5" />
        ) : (
          <ChevronDown className="text-slate-400 flex-shrink-0 w-5 h-5" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-sm sm:text-base text-slate-600 pb-4 pr-4 sm:pr-8 leading-relaxed whitespace-pre-line">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Component ---

// @component: PantheonOABSalesPage
export const PantheonOABSalesPage = (_props: PantheonConcursosProps) => {
  useEffect(() => {
    const container = document.getElementById("ra-verified-seal");
    if (!container) return;

    const existingScript = container.querySelector<HTMLScriptElement>("#ra-embed-verified-seal");
    if (existingScript) return;

    container.innerHTML = "";
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "ra-embed-verified-seal";
    script.src = "https://s3.amazonaws.com/raichu-beta/ra-verified/bundle.js";
    script.setAttribute("data-id", "WV9PZEpydmFxVF91cEtxdTpwYW50aGVvbi1jdXJzb3M=");
    script.setAttribute("data-target", "ra-verified-seal");
    script.setAttribute("data-model", "horizontal_1");
    container.appendChild(script);
  }, []);

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // @return
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* 1ª SEÇÃO: Hero */}
      <section className="relative pt-6 pb-12 sm:pt-8 sm:pb-16 md:pt-12 md:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white -z-10" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-red-100/50 rounded-full blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center min-h-[500px] md:min-h-[600px]">
            {/* Conteúdo à esquerda */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6 sm:mb-8"
              >
                <img
                  src="https://storage.googleapis.com/storage.magicpath.ai/user/358933834814865408/assets/71b92765-9089-4f76-aa22-6c855b4c6b78.png"
                  alt="Pantheon Concursos"
                  className="h-12 sm:h-14 md:h-16 w-auto"
                  style={{
                    objectFit: "scale-down",
                    objectPosition: "50% 50%",
                    opacity: "1",
                    width: "200px",
                    maxWidth: "200px",
                    height: "36px",
                  }}
                />
              </motion.div>

              <span className="inline-flex w-fit px-3 sm:px-4 py-1 rounded-full bg-[#771819]/10 text-[#771819] text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 sm:mb-6">
                APROVAÇÃO OAB 2026
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4 sm:mb-6 leading-tight">
                Tudo o que a <span className="text-[#771819]">OAB cobra na prova</span>,
                organizado para você estudar no <span className="text-[#771819]">padrão da FGV</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                Plataforma completa para a 1ª e 2ª Fase da OAB com teoria, provas comentadas,
                simulados e mapas mentais, do edital à prova.
              </p>

              {/* Imagem à direita - aparece aqui no mobile */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative md:hidden mb-6"
              >
                <img
                  src="https://storage.googleapis.com/storage.magicpath.ai/user/358933834814865408/assets/ecad40c3-578d-4a3f-b65c-1d79618b1b6b.png"
                  alt="Plataforma Pantheon OAB - Sistema de Questões e Simulados"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  style={{
                    objectFit: "scale-down",
                    objectPosition: "top",
                    opacity: "1",
                  }}
                />
              </motion.div>

              <div className="mt-2">
                <CTAButton onClick={scrollToPricing}>Quero começar agora</CTAButton>
              </div>
            </motion.div>

            {/* Imagem à direita - aparece aqui no desktop */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden md:flex items-center justify-center"
            >
              <img
                src="https://storage.googleapis.com/storage.magicpath.ai/user/358933834814865408/assets/7a9aae11-e0b3-4ccf-b9e5-44add58775ef.png"
                alt="Plataforma Pantheon OAB - Sistema de Questões e Simulados"
                className="w-full h-auto rounded-2xl shadow-2xl max-h-[550px]"
                style={{
                  objectFit: "contain",
                  objectPosition: "50% 50%",
                  opacity: "1",
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2ª SEÇÃO: Capacidade/Benefícios */}
      <section className="py-16 sm:py-24 bg-white px-4 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-2">
              Ao usar a plataforma Pantheon OAB, você será capaz de:
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <FeatureCard
              icon={Crosshair}
              title="Priorização Inteligente"
              description="Transformar o edital em um plano de estudo prático, sem precisar decidir sozinho o que priorizar."
            />
            <FeatureCard
              icon={FileCheck}
              title="Padrão FGV"
              description="Reconhecer padrões de cobrança da OAB ao treinar com provas reais comentadas e focadas na banca."
            />
            <FeatureCard
              icon={Map}
              title="Revisão Objetiva"
              description="Revisar com objetividade, usando mapas mentais pensados para cada uma das disciplinas da 1ª Fase."
            />
            <FeatureCard
              icon={Timer}
              title="Ritmo de Prova"
              description="Treinar com simulados diários, ganhando ritmo e familiaridade com o formato real da prova."
            />
            <FeatureCard
              icon={BookOpen}
              title="Teoria Conectada"
              description="Estudar a teoria conectada às questões da OAB, entendendo o conteúdo do ponto de vista da banca."
            />
            <FeatureCard
              icon={LibraryBig}
              title="Ordem Lógica e Direcionada"
              description="Estudar com uma ordem lógica e direcionada, sabendo exatamente o que vem antes, o que vem depois e o que merece mais atenção em cada etapa da preparação"
            />
          </div>
          <div className="text-center mt-10 sm:mt-12">
            <CTAButton onClick={scrollToPricing}>Quero ser aprovado</CTAButton>
          </div>
        </div>
      </section>

      {/* 3ª SEÇÃO: Para quem é */}
      <section className="py-16 sm:py-24 bg-[#771819] text-white px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center px-2">
            Para quem a Plataforma Pantheon OAB é recomendada
          </h2>
          <div className="space-y-4 sm:space-y-6 mb-10 sm:mb-12">
            {[
              "Para quem tem dificuldade em montar uma rotina de estudos que realmente funcione",
              "Para quem estuda com a sensação de que pode estar usando o material errado",
              "Para quem precisa otimizar o pouco tempo disponível e não pode desperdiçar horas",
              "Para quem carrega o receio de reprovar novamente na 1ª ou na 2ª fase da OAB",
              "Para quem sente que são matérias demais para estudar e pouco tempo para dar conta de tudo",
              "Para quem não sabe a ordem certa de matérias para estudar, nem qual priorizar",
            ].map((text, index) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={text}
                className="flex gap-3 sm:gap-4 items-start bg-white/10 p-4 sm:p-6 rounded-2xl border border-white/5"
              >
                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-[#0BA106]/20 text-[#0BA106] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <CTAButton onClick={scrollToPricing}>Quero começar agora</CTAButton>
          </div>
        </div>
      </section>

      {/* 4ª SEÇÃO: Depoimentos */}
      <section className="py-16 sm:py-24 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 px-2">
            Veja o que mudou na preparação de quem estuda com o Pantheon OAB
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {TESTIMONIALS.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-4 text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-700 italic mb-6 leading-relaxed">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#771819] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">
                      {testimonial.name}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <CTAButton onClick={scrollToPricing}>
              Quero me preparar para a OAB
            </CTAButton>
          </div>
        </div>
      </section>

      {/* 5ª SEÇÃO: Features Detalhadas */}
      <section className="py-16 sm:py-24 bg-slate-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 sm:mb-6 px-2">
              O que você vai receber ao entrar no Pantheon OAB
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 px-2">
              Uma preparação pensada do edital até o dia da prova. Do jeito que a FGV realmente cobra.
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {/* Intro Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 sm:p-8 md:p-12 rounded-[32px] sm:rounded-[40px] shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <p
                className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed"
                style={{ display: "none" }}
              >
                A OAB cobra 20 disciplinas na 1ª Fase, em um intervalo médio de 90 dias entre o edital
                e a prova. Estudar tudo, de forma genérica, simplesmente não funciona.
              </p>
              <p
                className="text-base sm:text-lg lg:text-xl font-bold text-[#771819] mb-6 sm:mb-8"
                style={{ display: "none" }}
              >
                Por isso, no Pantheon OAB, todo o conteúdo é organizado com base no que já foi cobrado
                nos Exames anteriores. Você estuda o que precisa. Nem mais. Nem menos.
              </p>

              <div className="grid sm:grid-cols-2 gap-8 sm:gap-12 mt-8 sm:mt-16">
                <div className="space-y-6">
                  <div className="flex gap-3 sm:gap-4">
                    <BookOpen className="text-[#771819] flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2">Teoria direcionada</h3>
                      <p className="text-sm sm:text-base text-slate-600">
                        Aulas construídas a partir das cobranças reais da FGV. Nada de conteúdo
                        aleatório. +1.000 aulas organizadas.
                      </p>
                      <img
                        src="https://storage.googleapis.com/storage.magicpath.ai/user/358933834814865408/assets/4366694a-32dd-429f-a0e0-a9216cbef511.png"
                        alt="Teoria direcionada - Meus Cursos"
                        className="mt-4 rounded-lg w-full h-auto"
                        style={{
                          objectFit: "scale-down",
                          objectPosition: "50% 50%",
                          opacity: "1",
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 sm:gap-4">
                    <Map className="text-[#771819] flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2">
                        Mapas Mentais Estratégicos
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600">
                        Revisão eficiente por disciplina, assunto e padrão de cobrança. Economize tempo
                        e fixe o que importa.
                      </p>
                      <img
                        src="https://storage.googleapis.com/storage.magicpath.ai/user/358933834814865408/assets/021f7dda-ee37-4657-b7e6-ff7dc8030525.png"
                        alt="Mapas Mentais"
                        className="mt-4 rounded-lg w-full h-auto"
                        style={{
                          objectFit: "scale-down",
                          objectPosition: "50% 50%",
                          opacity: "1",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-3 sm:gap-4">
                    <FileText className="text-[#771819] flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2">Provas Comentadas</h3>
                      <p className="text-sm sm:text-base text-slate-600">
                        Todas as provas anteriores com comentários objetivos dos professores focados no
                        raciocínio da banca.
                      </p>
                      <img
                        src="https://storage.googleapis.com/storage.magicpath.ai/user/358933834814865408/assets/10ae8bcc-cd81-4b75-9fc6-cb6af46366ba.png"
                        alt="Provas Comentadas - Sistema de Questões"
                        className="mt-4 rounded-lg w-full h-auto"
                        style={{
                          objectFit: "scale-down",
                          objectPosition: "50% 50%",
                          opacity: "1",
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 sm:gap-4">
                    <BarChart3 className="text-[#771819] flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2">Sistema de Questões</h3>
                      <p className="text-sm sm:text-base text-slate-600">
                        Treino diário com filtros por disciplina e assunto. Acompanhe sua evolução com
                        +100 mil questões.
                      </p>
                      <img
                        src="https://storage.googleapis.com/storage.magicpath.ai/user/358933834814865408/assets/17801b87-60ee-4b15-8bea-a016a27cf0c5.png"
                        alt="Sistema de Questões"
                        className="mt-4 rounded-lg w-full h-auto"
                        style={{
                          objectFit: "scale-down",
                          objectPosition: "center",
                          opacity: "1",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 sm:gap-12 mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-slate-100">
                <div className="flex gap-3 sm:gap-4">
                  <Scale className="text-[#771819] flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2">Vade Mecum Digital</h3>
                    <p className="text-sm sm:text-base text-slate-600">
                      Legislação integrada: CF, Códigos, Estatuto da OAB e Jurisprudência atualizada e
                      fácil de navegar.
                    </p>
                    <img
                      src="https://storage.googleapis.com/storage.magicpath.ai/user/358933834814865408/assets/d0d64de1-c6a3-49fa-936e-8fd148ff1662.png"
                      alt="Vade Mecum Digital"
                      className="mt-4 rounded-lg w-full h-auto"
                      style={{
                        objectFit: "scale-down",
                        objectPosition: "50% 50%",
                        opacity: "1",
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <Mail className="text-[#771819] flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2">
                      Simulados Diários (Bônus)
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600">
                      Receba simulados prontos por e-mail baseados em cobranças reais para imprimir ou
                      fazer online.
                    </p>
                    <img
                      src="https://storage.googleapis.com/storage.magicpath.ai/user/358933834814865408/assets/d69f04cf-be5e-4cad-b4a4-2836c5d7bb57.png"
                      alt="Simulados Diários"
                      className="mt-4 rounded-lg w-full h-auto"
                      style={{
                        objectFit: "scale-down",
                        objectPosition: "50% 50%",
                        opacity: "1",
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Garantia */}
            <div className="bg-[#771819] text-white p-6 sm:p-8 md:p-12 rounded-[32px] sm:rounded-[40px] flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <div className="flex-shrink-0">
                <img
                  src="https://storage.googleapis.com/storage.magicpath.ai/user/358933834814865408/assets/6bad049e-86a1-4e00-b732-89965332ba03.png"
                  alt="7 Dias de Garantia Incondicional"
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain"
                  style={{
                    objectFit: "scale-down",
                    objectPosition: "center",
                    opacity: "1",
                  }}
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                  Garantia incondicional de 7 dias
                </h3>
                <p className="text-sm sm:text-base text-white/90">
                  Teste a plataforma sem riscos. Se não for o que você esperava, devolvemos 100% do
                  seu investimento. Sem perguntas, sem burocracia.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <CTAButton onClick={scrollToPricing}>Quero começar agora</CTAButton>
          </div>
        </div>
      </section>

      {/* 6ª SEÇÃO: Planos */}
      <section id="pricing" className="py-16 sm:py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 px-2 leading-tight">
              Desbloqueie agora o nosso algoritmo de aprovação e veja sua nota na prova da OAB
              disparar
            </h2>
            <p className="text-xl text-slate-600" style={{ display: "none" }}>
              Invista no seu futuro profissional hoje mesmo.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {PLANS.map((plan) => (
              <PricingCard key={plan.title} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* 7ª SEÇÃO: FAQ */}
      <section className="py-16 sm:py-24 bg-slate-50 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-12 justify-center">
            <div
              className="w-12 h-12 bg-[#771819]/10 text-[#771819] rounded-full flex items-center justify-center"
              style={{ display: "none" }}
            >
              <LibraryBig size={24} />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
              Ainda com dúvidas?
            </h2>
          </div>
          <p className="text-center text-base sm:text-lg text-slate-600 mb-8 sm:mb-12 px-2">
            Abaixo você encontra as perguntas mais comuns sobre o nosso curso
          </p>
          <div className="bg-white p-4 sm:p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200">
            {FAQS.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </div>

          <div
            className="mt-12 sm:mt-16 text-center bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-slate-200 shadow-sm"
            style={{ display: "none" }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Ainda tem alguma dúvida?
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 px-2">
              Nossa equipe está pronta para te ajudar a escolher a melhor preparação.
            </p>
            <a
              href="mailto:contato@pantheonconcursos.com.br"
              className="inline-flex items-center gap-2 text-[#771819] font-bold hover:underline text-sm sm:text-base break-all sm:break-normal"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="break-all">contato@pantheonconcursos.com.br</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer Completo */}
      <footer className="bg-[#771819] text-white py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Conteúdo Principal do Footer */}
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 mb-12">
            {/* Coluna Esquerda */}
            <div>
              {/* Logo */}
              <img
                src="https://storage.googleapis.com/storage.magicpath.ai/user/358933834814865408/assets/1da05a18-2b88-496c-bee5-e5ef76d49bc8.png"
                alt="Pantheon Concursos"
                className="h-12 sm:h-14 w-auto mb-6"
                style={{
                  maxWidth: "250px",
                  objectFit: "scale-down",
                  objectPosition: "0% 50%",
                  opacity: "1",
                }}
              />

              {/* Descrição */}
              <p className="text-white/90 mb-6 text-sm sm:text-base leading-relaxed">
                Curso 100% on line com tudo o que você precisa para se preparar para a 1ª e 2ª Fase
                da OAB.
              </p>

              {/* Redes Sociais */}
              <div className="mb-8">
                <h3 className="text-lg sm:text-xl font-bold mb-4">
                  Acompanhe o Pantheon nas redes sociais
                </h3>
                <div className="flex gap-3">
                  <a
                    href="https://www.facebook.com/pantheonconcursos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#1877F2] hover:bg-[#166FE5] rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Facebook size={24} fill="white" />
                  </a>
                  <a
                    href="https://www.instagram.com/pantheonconcursos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 rounded-lg flex items-center justify-center transition-opacity"
                  >
                    <Instagram size={24} />
                  </a>
                </div>
              </div>
            </div>

            {/* Coluna Direita - Contato */}
            <div>
              {/* Email */}
              <div className="mb-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1">Nosso e-mail</h3>
                  <a
                    href="mailto:contato@pantheonconcursos.com.br"
                    className="text-white/90 hover:text-white transition-colors text-sm sm:text-base break-all"
                  >
                    contato@pantheonconcursos.com.br
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="mb-8 flex items-start gap-4">
                <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1">Nosso WhatsApp</h3>
                  <a
                    href="https://wa.me/5511981989890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/90 hover:text-white transition-colors text-sm sm:text-base"
                  >
                    (11) 98198-9890
                  </a>
                </div>
              </div>

              {/* Selos de Segurança */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Google Safe Browsing */}
                <img
                  src="https://storage.googleapis.com/storage.magicpath.ai/user/358933834814865408/assets/05941013-045c-449a-a728-6b979ad558d2.png"
                  alt="Google Safe Browsing"
                  className="h-12 sm:h-14 w-auto"
                  style={{
                    objectFit: "contain",
                    objectPosition: "50% 50%",
                    opacity: "1",
                    marginLeft: "0px",
                    width: "200px",
                    maxWidth: "200px",
                    height: "70px",
                  }}
                />

                {/* Reclame Aqui */}
                <div id="ra-verified-seal" />
              </div>
            </div>
          </div>

          {/* Linha Divisória */}
          <div className="border-t border-white/20 mb-8"></div>

          {/* Copyright e Links Legais */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-white/70">
            <div className="text-center sm:text-left">
              <p className="mb-1">© {new Date().getFullYear()} Pantheon Concursos. Todos os direitos reservados.</p>
              <p>Avenida Paulista, 1636 - Sala 1504 – Bela Vista São Paulo / SP</p>
              <p>(CNPJ: 32.167.584/0001-80)</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PantheonOABSalesPage;
