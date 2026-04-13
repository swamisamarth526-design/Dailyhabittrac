export const getApiUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL?.trim() ?? "http://localhost:5001";

  const normalizedBase = baseUrl.replace(/\/+$/g, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
};