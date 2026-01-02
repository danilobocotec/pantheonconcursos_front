import React from "react";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

type CheckoutSuccessProps = {
  onNavigate?: (page: string) => void;
};

export const CheckoutSuccess = ({ onNavigate }: CheckoutSuccessProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
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
            <button
              onClick={() => onNavigate?.("aprova-oab")}
              className="hover:text-gray-900"
            >
              Quero ser aprovado
            </button>
          </nav>
          <button
            onClick={() => onNavigate?.("home")}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-6 py-2 rounded-full"
          >
            Entrar
          </button>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#7b1b1b]">
              Parabens! Compra realizada com sucesso!
            </h1>
            <p className="text-gray-700 leading-relaxed">
              Estamos muito felizes por voce ter escolhido o{" "}
              <span className="font-semibold text-[#7b1b1b]">
                Pantheon Concursos
              </span>{" "}
              para te acompanhar nessa jornada ate a sua aprovacao!
            </p>
            <p className="text-gray-700 leading-relaxed">
              Voce vai receber no seu e-mail as informacoes de acesso, ok?
            </p>
            <p className="text-gray-800 font-semibold">Bons estudos!</p>
          </div>
        </div>
      </main>

      <footer className="bg-[#7b1b1b] text-white">
        <div className="container mx-auto px-4 py-14 grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <img
              src="/logo-pantheon-dark.png"
              alt="Pantheon Concursos"
              className="h-12 w-auto"
            />
            <p className="text-sm text-white/80">
              Curso 100% on line com tudo o que voce precisa para se preparar
              para a 1a e 2a Fase da OAB.
            </p>
            <div className="space-y-3">
              <p className="text-sm font-semibold">
                Acompanhe o Pantheon nas redes sociais
              </p>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Nosso e-mail</p>
                <p className="text-sm text-white/80">contato@pantheonconcursos.com.br</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Nosso WhatsApp</p>
                <p className="text-sm text-white/80">(11) 98198-9890</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-semibold">Confianca e seguranca</p>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-lg bg-white/10 px-4 py-3 text-xs uppercase tracking-wide">
                Google Safe Browsing
              </div>
              <div className="rounded-lg bg-white/10 px-4 py-3 text-xs uppercase tracking-wide">
                Verificada por ReclameAQUI
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CheckoutSuccess;
