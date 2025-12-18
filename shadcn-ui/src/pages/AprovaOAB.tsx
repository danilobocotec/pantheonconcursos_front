import React from "react";
import {
  Trophy,
  ChevronRight,
  CheckCircle,
  Star,
  BookOpen,
  Users,
  Target,
  Shield,
  Calendar,
  Award,
  ArrowLeft,
} from "lucide-react";

type AprovaOABProps = {
  onNavigate?: (page: string) => void;
};

const AprovaOAB: React.FC<AprovaOABProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate?.("home")}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Pantheon Concursos
              </span>
            </button>
            <button
              onClick={() => onNavigate?.("home")}
              className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
                🎯 Método Exclusivo de Aprovação
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Transforme seu Sonho de{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Passar na OAB
              </span>{" "}
              em Realidade
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-10">
              Descubra o método que já aprovou milhares de candidatos em todo o Brasil.
              Uma preparação completa, estratégica e focada em resultados reais.
            </p>
            <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-12 py-5 rounded-lg font-bold text-xl hover:shadow-xl transition-all hover:scale-105 inline-flex items-center gap-2">
              Quero Ser Aprovado(a) Agora
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* O Que Você Vai Receber */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              O Que Você Vai{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Receber
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Um método completo e comprovado para sua aprovação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Videoaulas Completas</h3>
              <p className="text-gray-700 leading-relaxed">
                Mais de 500 horas de conteúdo gravado pelos melhores professores do mercado. Assista quando e onde quiser.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">100.000+ Questões</h3>
              <p className="text-gray-700 leading-relaxed">
                Banco de questões comentadas para você treinar e fixar todo o conteúdo necessário para a prova.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mentoria Individual</h3>
              <p className="text-gray-700 leading-relaxed">
                Acompanhamento personalizado com professores especializados para tirar suas dúvidas e guiar seus estudos.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">750+ Mapas Mentais</h3>
              <p className="text-gray-700 leading-relaxed">
                Material exclusivo para revisão rápida e eficiente de todos os assuntos da prova.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cronograma Personalizado</h3>
              <p className="text-gray-700 leading-relaxed">
                Planejamento de estudos adaptado ao seu tempo e necessidades específicas.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Simulados Oficiais</h3>
              <p className="text-gray-700 leading-relaxed">
                Simulados no mesmo formato da prova oficial para você testar seus conhecimentos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Método de Estudo */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Nosso{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Método
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Uma jornada estruturada em 4 passos para sua aprovação
            </p>
          </div>

        <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Diagnóstico Inicial</h3>
                <p className="text-gray-700 leading-relaxed">
                  Avaliamos seu nível de conhecimento e traçamos um plano de estudos personalizado baseado nas suas necessidades específicas.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Aprendizado Estruturado</h3>
                <p className="text-gray-700 leading-relaxed">
                  Videoaulas organizadas por matéria com professores especializados. Conteúdo teórico completo e atualizado.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Prática Intensiva</h3>
                <p className="text-gray-700 leading-relaxed">
                  Resolução de milhares de questões comentadas e simulados. Quanto mais você pratica, mais próximo da aprovação.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">4</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Aprovação Garantida</h3>
                <p className="text-gray-700 leading-relaxed">
                  Acompanhamento até sua aprovação. Se não passar, continue estudando conosco gratuitamente até conquistar sua vaga.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Quem Já Foi{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Aprovado
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Veja o que nossos alunos aprovados têm a dizer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
                  alt="Maria Santos"
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-orange-200"
                />
                <div>
                  <h4 className="font-bold text-gray-900">Maria Santos</h4>
                  <p className="text-sm text-orange-600">Aprovada OAB XXXVIII</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                "O Pantheon mudou minha vida! Depois de duas reprovações, finalmente consegui a aprovação. O método é sensacional e os professores são incríveis!"
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
                  alt="João Silva"
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-orange-200"
                />
                <div>
                  <h4 className="font-bold text-gray-900">João Silva</h4>
                  <p className="text-sm text-orange-600">Aprovado OAB XXXIX</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                "Material completo e suporte excelente. Consegui conciliar trabalho e estudos graças ao cronograma personalizado. Recomendo demais!"
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
                  alt="Ana Paula"
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-orange-200"
                />
                <div>
                  <h4 className="font-bold text-gray-900">Ana Paula</h4>
                  <p className="text-sm text-orange-600">Aprovada OAB XL</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                "Passei de primeira com o Pantheon! O banco de questões e os simulados foram fundamentais para minha aprovação. Muito obrigada!"
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planos de Curso */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ color: "#7c1d1d" }}
            >
              Nunca mais compre outro curso para a OAB
            </h2>
            <p className="text-xl text-gray-900 font-semibold">
              Curso OAB 1ª Fase com acesso vitalício.
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all relative">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">OAB 1ª Fase Anual</h3>
                <div className="mb-4">
                  <span className="text-gray-600 line-through text-base">De R$ 453,70 por</span>
                  <span className="ml-2 text-red-600 font-bold text-sm">30% OFF</span>
                </div>
                <div className="mb-2">
                  <span className="text-base text-gray-700">12x </span>
                  <span className="text-5xl font-bold text-gray-900">34,90</span>
                </div>
                <p className="text-gray-600 text-sm">ou 349,00 à vista no PIX</p>
              </div>

              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full mb-6 transition-colors">
                COMECE AGORA
              </button>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Acesso imediato à TODA 1ª Fase da OAB</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Sistema de Questões com + 100 mil questões on-line</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">+ 750 Mapas Mentais</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Acesso ao Vade Mecum Digital</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">+ 1.000 Livros digitais (teoria baseada nas questões)</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all relative transform md:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  MAIS VENDIDO
                </span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-6">OAB 1ª Fase Vitalício</h3>
                <div className="mb-4">
                  <span className="text-orange-200 line-through text-base">De R$ 550,62 por</span>
                  <span className="ml-2 text-yellow-300 font-bold text-sm">38% OFF</span>
                </div>
                <div className="mb-2">
                  <span className="text-base text-white">12x </span>
                  <span className="text-5xl font-bold text-white">39,90</span>
                </div>
                <p className="text-orange-200 text-sm">ou 399,00 à vista no PIX</p>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-full mb-6 transition-colors shadow-lg">
                COMECE AGORA
              </button>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-sm font-medium">Acesso VITALÍCIO à TODO conteúdo da 1ª Fase da OAB</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-sm font-medium">Envio de Simulados Diários</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-sm font-medium">Sistema de Questões com + 100 mil questões on-line</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-sm font-medium">Acesso Imediato à TODA 1ª Fase da OAB</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-sm font-medium">+ 750 Mapas Mentais</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-sm font-medium">Acesso ao Vade Mecum Digital</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-sm font-medium">+ 1.000 Livros digitais (teoria baseada nas questões)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all relative">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">OAB 1ª e 2ª Fase Anual</h3>
                <div className="mb-4">
                  <span className="text-gray-600 line-through text-base">De R$ 908,65 por</span>
                  <span className="ml-2 text-red-600 font-bold text-sm">35% OFF</span>
                </div>
                <div className="mb-2">
                  <span className="text-base text-gray-700">12x </span>
                  <span className="text-5xl font-bold text-gray-900">59,90</span>
                </div>
                <p className="text-gray-600 text-sm">ou 599,00 à vista no PIX</p>
              </div>

              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full mb-6 transition-colors">
                COMECE AGORA
              </button>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Acesso imediato à TODA 1ª Fase da OAB</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Acesso imediato à 2ª Fase da OAB (Direito do Trabalho; Direito Penal e Direito Civil)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Sistema de Questões com + 100 mil questões on-line</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">+ 750 Mapas Mentais</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Acesso ao Vade Mecum Digital</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">+ 1.000 Livros digitais (teoria baseada nas questões)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Garantia */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-12 shadow-2xl text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Garantia de{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Aprovação
              </span>
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Estamos tão confiantes no nosso método que oferecemos garantia total: se você não passar no exame, continue estudando conosco{" "}
              <strong>totalmente grátis</strong> até sua aprovação!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-orange-600 mb-3" />
                <p className="text-gray-700 font-medium">Acesso Estendido Grátis</p>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-orange-600 mb-3" />
                <p className="text-gray-700 font-medium">Suporte Ilimitado</p>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-orange-600 mb-3" />
                <p className="text-gray-700 font-medium">Material Atualizado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Comece Sua Jornada de Aprovação Hoje!
          </h2>
          <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Não deixe seu sonho para depois. Milhares de alunos já conquistaram a aprovação com o Pantheon. O próximo pode ser você!
          </p>
          <button className="bg-white text-orange-600 px-12 py-5 rounded-lg font-bold text-xl hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2">
            Garantir Minha Vaga Agora
            <ChevronRight className="w-6 h-6" />
          </button>
          <p className="text-orange-100 mt-6 text-sm">
            ⚡ Vagas limitadas • 🎯 Acesso imediato • 🔒 Pagamento 100% seguro
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Pantheon Concursos</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 Pantheon Concursos. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AprovaOAB;
