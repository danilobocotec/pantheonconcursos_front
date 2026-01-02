import React from "react";
import { buildApiUrl } from "@/lib/api";
import { Eye, EyeOff, X } from "lucide-react";

type PantheonConcursosProps = {
  onNavigate?: (page: string) => void;
};

export const PantheonConcursos = ({ onNavigate }: PantheonConcursosProps) => {
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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-6 py-10 text-center space-y-5">
        <button
          onClick={() => onNavigate?.("visao-geral")}
          className="w-full border border-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
        >
          Teste a nossa plataforma
        </button>
        <button
          onClick={() => onNavigate?.("aprova-oab")}
          className="w-full border border-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
        >
          Aprova OAB
        </button>
        <button
          onClick={() => setLoginModalOpen(true)}
          className="w-full border border-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
        >
          Login
        </button>
      </div>

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
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Faca login com sua conta
                </h2>
                <p className="text-2xl font-bold text-gray-900">Pantheon</p>
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

                {loginError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {loginError}
                  </div>
                )}

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


