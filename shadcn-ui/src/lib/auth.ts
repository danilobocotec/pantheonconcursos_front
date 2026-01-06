import { buildApiUrl } from './api';

export interface AuthenticatedFetchOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Verifica se o usuário está autenticado
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('pantheon:token');
};

/**
 * Obtém o token de autenticação
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('pantheon:token');
};

/**
 * Remove o token de autenticação
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem('pantheon:token');
  localStorage.removeItem('pantheon:isAdmin');
  localStorage.removeItem('pantheon:user');
};

/**
 * Realiza uma chamada HTTP autenticada
 */
export const authenticatedFetch = async (
  url: string,
  options: AuthenticatedFetchOptions = {}
): Promise<Response> => {
  const { skipAuth, headers, ...restOptions } = options;

  // Montar headers
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Adicionar token de autenticação se não for skipAuth
  if (!skipAuth) {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Fazer a requisição
  const response = await fetch(buildApiUrl(url), {
    ...restOptions,
    headers: requestHeaders,
  });

  // Verificar se a resposta indica falta de autentica��ǜo
  if (response.status === 401 || response.status === 403) {
    const responseText = await response.text();
    if (responseText.toLowerCase().includes('bloqueadousodiario')) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('pantheon:daily-limit', { detail: { message: responseText } })
        );
      }
      throw new Error('Bloqueadousodiario');
    }
    clearAuthToken();
    throw new Error('Sessǜo expirada');
  }

  return response;
};

/**
 * Realiza uma chamada GET autenticada
 */
export const authenticatedGet = async (url: string): Promise<any> => {
  const response = await authenticatedFetch(url, { method: 'GET' });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  return response.json();
};

/**
 * Realiza uma chamada POST autenticada
 */
export const authenticatedPost = async (url: string, data: any): Promise<any> => {
  const response = await authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  return response.json();
};

/**
 * Realiza uma chamada PUT autenticada
 */
export const authenticatedPut = async (url: string, data: any): Promise<any> => {
  const response = await authenticatedFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  return response.json();
};

/**
 * Realiza uma chamada DELETE autenticada
 */
export const authenticatedDelete = async (url: string): Promise<any> => {
  const response = await authenticatedFetch(url, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  return response.json();
};
