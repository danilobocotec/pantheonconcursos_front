const DEFAULT_API_BASE_URL = "http://localhost:8080/api/v1";

const normalizeBaseUrl = (baseUrl: string) => {
  if (!baseUrl) {
    return DEFAULT_API_BASE_URL;
  }

  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
};

const ensureLeadingSlash = (path: string) => {
  if (!path) {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
};

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL
);

export const buildApiUrl = (path = "") => {
  if (!path) {
    return API_BASE_URL;
  }

  return `${API_BASE_URL}${ensureLeadingSlash(path)}`;
};
