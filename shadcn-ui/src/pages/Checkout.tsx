import React, { useState } from "react";
import { Trophy, Shield, Check, CreditCard, X, Copy, CheckCircle } from "lucide-react";
import { buildApiUrl } from "@/lib/api";

type CheckoutPlan = {
  key: string;
  name: string;
  installmentPrice: number;
  pixPrice: number;
  features: string[];
};

type CheckoutPageProps = {
  onNavigate?: (page: string) => void;
  planKey?: string;
};

const PLANS: Record<string, CheckoutPlan> = {
  "oab-1-fase-anual": {
    key: "oab-1-fase-anual",
    name: "OAB 1a Fase Anual",
    installmentPrice: 34.9,
    pixPrice: 349,
    features: [
      "Acesso imediato a TODA 1a Fase da OAB",
      "Sistema de questoes com + 100 mil questoes on-line",
      "+ 750 Mapas Mentais",
      "Acesso ao Vade Mecum Digital",
      "+ 1.000 Livros digitais (teoria baseada nas questoes)",
    ],
  },
  "oab-1-fase-vitalicio": {
    key: "oab-1-fase-vitalicio",
    name: "OAB 1a Fase Vitalicio",
    installmentPrice: 39.9,
    pixPrice: 399,
    features: [
      "Acesso VITALICIO a TODO conteudo da 1a Fase da OAB",
      "Envio de Simulados Diarios",
      "Sistema de questoes com + 100 mil questoes on-line",
      "Acesso imediato a TODA 1a Fase da OAB",
      "+ 750 Mapas Mentais",
      "Acesso ao Vade Mecum Digital",
      "+ 1.000 Livros digitais (teoria baseada nas questoes)",
    ],
  },
  "oab-1-fase-2-fase-anual": {
    key: "oab-1-fase-2-fase-anual",
    name: "OAB 1a e 2a Fase Anual",
    installmentPrice: 59.9,
    pixPrice: 599,
    features: [
      "Acesso imediato a TODA 1a Fase da OAB",
      "Acesso imediato a 2a Fase da OAB (Trabalho, Penal e Civil)",
      "Sistema de questoes com + 100 mil questoes on-line",
      "+ 750 Mapas Mentais",
      "Acesso ao Vade Mecum Digital",
      "+ 1.000 Livros digitais (teoria baseada nas questoes)",
    ],
  },
};

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const CheckoutPage = (props: CheckoutPageProps) => {
  const { onNavigate, planKey } = props;
  const selectedPlan =
    PLANS[planKey ?? "oab-1-fase-vitalicio"] ?? PLANS["oab-1-fase-vitalicio"];
  const totalCreditPrice = selectedPlan.installmentPrice * 12;
  const installmentOptions = Array.from({ length: 12 }, (_, index) => {
    const count = index + 1;
    return {
      value: String(count),
      label: `${count}x de R$ ${formatCurrency(totalCreditPrice / count)} sem juros`,
    };
  });

  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit">("credit");
  const [showPixModal, setShowPixModal] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "Danilo Augusto",
    email: "guilherme.matossouza@gmail.com",
    phone: "(22) 2 2222-2222",
    cpf: "390.202.568-90",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    cep: "",
    number: "",
    installments: "12",
  });
  const [pixCode] = useState(
    "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540599.005802BR5913Pantheon Cursos6009Sao Paulo62070503***6304ABCD"
  );
  const [copiedPix, setCopiedPix] = useState(false);
  const [countdown, setCountdown] = useState(59 * 60 + 54); // 59:54

  React.useEffect(() => {
    if (showPixModal && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showPixModal, countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "pix") {
      setShowPixModal(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const externalReference = `oab-${selectedPlan.key}-${Date.now()}`;
      const customer = await postJson("/asaas/customers", {
        cpfCnpj: formData.cpf,
        email: formData.email,
        externalReference,
        mobilePhone: formData.phone,
        name: formData.fullName,
        notificationDisabled: true,
        phone: formData.phone,
      });
      const customerId = customer?.id ?? customer?.customer?.id;
      if (!customerId) {
        throw new Error("Cliente nao retornou ID.");
      }

      const payment = await postJson("/asaas/payments", {
        billingType: "CREDIT_CARD",
        customer: customerId,
        description: selectedPlan.name,
        dueDate: new Date().toISOString().slice(0, 10),
        externalReference,
        value: totalCreditPrice,
      });

      const cardNumber = formData.cardNumber.replace(/\D/g, "");
      const { month, year } = parseExpiry(formData.expiryDate);
      const paymentId = payment?.asaas_id ?? payment?.id;
      if (!paymentId) {
        throw new Error("Pagamento nao retornou ID.");
      }
      const cpfCnpj = formData.cpf.replace(/\D/g, "");
      const postalCode = formData.cep.replace(/\D/g, "");
      const phone = formData.phone.replace(/\D/g, "");
      await postJson(`/asaas/payments/${paymentId}/payWithCreditCard`, {
        creditCard: {
          ccv: formData.cvv,
          expiryMonth: month,
          expiryYear: year,
          holderName: formData.cardName || formData.fullName,
          number: cardNumber,
        },
        creditCardHolderInfo: {
          name: formData.fullName,
          email: formData.email,
          cpfCnpj,
          postalCode,
          addressNumber: formData.number,
          phone,
        },
      });

      onNavigate?.("checkout-success");
      return;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao processar pagamento.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice =
    paymentMethod === "pix" ? selectedPlan.pixPrice : totalCreditPrice;
  const paymentSummary =
    paymentMethod === "pix"
      ? "a vista no Pix"
      : `12x de R$ ${formatCurrency(selectedPlan.installmentPrice)}`;

  const formatCardNumberDisplay = (rawValue: string) => {
    const digits = rawValue.replace(/\D/g, "").slice(0, 16);
    const groups = digits.match(/.{1,4}/g) ?? [];
    const filledGroups = [...groups];
    while (filledGroups.length < 4) {
      filledGroups.push("****");
    }
    if (filledGroups.length > 0) {
      const lastIndex = filledGroups.length - 1;
      const lastGroup = filledGroups[lastIndex].padEnd(4, "*");
      filledGroups[lastIndex] = lastGroup;
    }
    return filledGroups.join(" ");
  };

  const formatExpiryDisplay = (rawValue: string) => {
    const trimmed = rawValue.trim();
    return trimmed.length > 0 ? trimmed : "MM/AA";
  };

  const formatCardNameDisplay = (rawValue: string) => {
    const trimmed = rawValue.trim();
    return trimmed.length > 0 ? trimmed.toUpperCase() : "NOME NO CARTAO";
  };

  const formatCvvDisplay = (rawValue: string) => {
    const digits = rawValue.replace(/\D/g, "").slice(0, 4);
    return digits.length > 0 ? digits : "***";
  };

  const parseExpiry = (rawValue: string) => {
    const digits = rawValue.replace(/\D/g, "");
    const month = digits.slice(0, 2);
    const year = digits.slice(2, 6);
    const normalizedYear = year.length === 2 ? `20${year}` : year;
    return { month, year: normalizedYear };
  };

  const postJson = async (path: string, payload: Record<string, unknown>) => {
    const response = await fetch(buildApiUrl(path), {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Erro ao processar pagamento.");
    }

    return response.json();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate?.("home")}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                PANTHEON CONCURSOS
              </span>
            </button>
            <div className="flex items-center gap-2 text-gray-700">
              <Shield className="w-5 h-5 text-red-800" />
              <span className="text-sm">Checkout protegido por SSL</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Garanta sua vaga com <span className="text-red-800">Pantheon</span>
              </h1>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Digite o nome completo
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Celular
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Digite seu CPF
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Como sera o pagamento?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("pix")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === "pix"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-6 h-6">
                        <path
                          fill="currentColor"
                          d="M6.5 2L4 4.5L6.5 7H9V4.5L6.5 2M17.5 2L15 4.5L17.5 7H20V4.5L17.5 2M6.5 17L4 19.5L6.5 22H9V19.5L6.5 17M17.5 17L15 19.5L17.5 22H20V19.5L17.5 17M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12 15.31 6 12 6M12 8.5C13.93 8.5 15.5 10.07 15.5 12S13.93 15.5 12 15.5 8.5 13.93 8.5 12 10.07 8.5 12 8.5Z"
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">Pix</div>
                      <div className="text-sm text-gray-600">a vista</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("credit")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === "credit"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">
                        Cartao de credito
                      </div>
                      <div className="text-sm text-blue-600">
                        ate 12x sem juros
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Credit Card Form */}
              {paymentMethod === "credit" && (
                <div className="space-y-6">
                  {/* Credit Card Visual */}
                  <div
                    className="relative w-full max-w-md mx-auto"
                    style={{ perspective: "1000px" }}
                  >
                    <div
                      className="relative w-full aspect-[1.586/1] transition-transform duration-500"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: isCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      }}
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-950 rounded-2xl p-6 shadow-2xl"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <div className="flex justify-between items-start mb-8">
                          <div className="w-12 h-10 bg-yellow-400 rounded opacity-80">
                            <svg viewBox="0 0 48 40" className="w-full h-full">
                              <rect x="4" y="8" width="20" height="16" fill="#d4af37" rx="2" />
                              <rect x="8" y="12" width="12" height="8" fill="#000" opacity="0.2" />
                            </svg>
                          </div>
                        </div>
                        <div className="space-y-4 text-white">
                          <div className="font-mono text-lg tracking-wider">
                            {formatCardNumberDisplay(formData.cardNumber)}
                          </div>
                          <div className="flex justify-between items-end">
                            <div>
                              <div className="text-xs opacity-70 mb-1">Valido ate:</div>
                              <div className="font-mono text-sm">
                                {formatExpiryDisplay(formData.expiryDate)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs opacity-70 mb-1">NOME NO CARTAO</div>
                              <div className="font-mono text-sm">
                                {formatCardNameDisplay(formData.cardName)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-950 rounded-2xl p-6 shadow-2xl"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <div className="h-10 bg-black/60 rounded-md mb-6" />
                        <div className="bg-white/90 rounded-md px-4 py-3 flex items-center justify-between">
                          <div className="text-xs text-gray-600">CVV</div>
                          <div className="font-mono text-sm text-gray-900">
                            {formatCvvDisplay(formData.cvv)}
                          </div>
                        </div>
                        <div className="mt-6 text-right text-white text-xs opacity-70">
                          PANTHEON CONCURSOS
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Digite o numero do cartao
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={paymentMethod === "credit"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Data de expiracao
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/AA"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={paymentMethod === "credit"}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Codigo CVV
                      </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      onFocus={() => setIsCardFlipped(true)}
                      onBlur={() => setIsCardFlipped(false)}
                      placeholder="000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={4}
                      required={paymentMethod === "credit"}
                    />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Nome no cartao
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={paymentMethod === "credit"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Cep
                      </label>
                      <input
                        type="text"
                        name="cep"
                        value={formData.cep}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={paymentMethod === "credit"}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Numero
                      </label>
                      <input
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={paymentMethod === "credit"}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Selecione as parcelas
                    </label>
                    <select
                      name="installments"
                      value={formData.installments}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      {installmentOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo</h2>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-900 font-semibold">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    R$ {formatCurrency(totalPrice)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {paymentSummary}
                </p>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">{selectedPlan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {paymentSummary}
                </p>
                <ul className="space-y-3">
                  {selectedPlan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-red-800 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors text-lg mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "ENVIANDO..." : "CONFIRMAR PAGAMENTO"}
              </button>

              {errorMessage && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <p className="text-xs text-gray-600 text-center">
                Ao continuar voce concorda com nossos{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Termos de uso
                </a>{" "}
                e nossa{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Politica de privacidade
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* PIX Modal */}
      {showPixModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowPixModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="bg-blue-600 text-white px-8 py-6 rounded-t-2xl">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Pedido aguardando pagamento!</h2>
              </div>
            </div>

            <div className="p-8">
              <div className="text-center mb-6">
                <p className="text-gray-700 font-semibold mb-4">
                  PIX disponivel para pagamento!
                  <br />
                  Faca o pagamento do PIX abaixo para finalizar o seu pedido:
                </p>

                {/* QR Code */}
                <div className="bg-blue-600 rounded-2xl p-6 max-w-sm mx-auto mb-4">
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMzAgMjMwIj48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMCAwaDIzMHYyMzBIMHoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjAgMjBoMTl2MTlIMjB6bTE5IDBIMjB2MTloMTl6bTAgMTlIMjBWMjBoMTl6bTE5LTE5aDM4djE5SDU4em0xOSAwaDM4djE5SDc3em0xOSAwaDM4djE5SDk2em0xOSAwaDM4djE5SDExNXptMTkgMGgzOHYxOUgxMzR6bTE5IDBoMzh2MTlIMTUzem0xOSAwaDM4djE5SDE3MnptMzggMGgxOXYxOWgtMTl6bTAgMTloMTlWMjBoLTE5ek0yMCA1OGgxOXYxOUgyMHptMCAxOWgxOXYxOUgyMHptMCAxOWgxOXYxOUgyMHptMTkgMGgxOXYxOUgzOXptMCAxOWgxOXYxOUgzOXptMTkgMGgxOXYxOUg1OHptMCAxOWgxOXYxOUg1OHptMTkgMGgxOXYxOUg3N3ptMCAxOWgxOXYxOUg3N3ptMTkgMGgxOXYxOUg5NnptMTkgMGgxOXYxOUgxMTV6bTE5IDBoMTl2MTlIMTM0em0wIDE5aDE5djE5SDEzNHptMTkgMGgxOXYxOUgxNTN6bTE5IDBoMTl2MTlIMTcyem0xOSAwaDMOdjE5SDE5MXptMTkgMGgxOXYxOUgyMTB6Ii8+PC9zdmc+"
                      alt="QR Code PIX"
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="text-white text-sm font-semibold mb-3">
                    Escaneie o QRCode ao lado ou
                    <br />
                    clique abaixo para copiar o codigo:
                  </p>
                  <button
                    onClick={handleCopyPixCode}
                    className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {copiedPix ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Codigo copiado!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Copy className="w-5 h-5" />
                        Copiar codigo PIX
                      </span>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 text-sm text-gray-700 mb-6">
                  <span>Seu codigo expira em:</span>
                  <div className="bg-blue-100 text-blue-800 font-mono font-bold px-4 py-2 rounded-full">
                    {formatTime(countdown)}
                  </div>
                  <span>
                    Valor a pagar: <strong>R$ {formatCurrency(totalPrice)}</strong>
                  </span>
                </div>
              </div>

              {/* Informacoes importantes */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Informacoes importantes</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    Todas as transacoes Pix sao criptografadas e autenticadas de acordo com as diretrizes do Banco Central.
                  </p>
                  <p>
                    Para liberar seu pedido, voce precisa pagar o Pix no seu internet banking ou aplicativo do seu banco.
                  </p>
                  <p>
                    O sistema identificara automaticamente o pagamento assim que voce concluir a transacao.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPixModal(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;






